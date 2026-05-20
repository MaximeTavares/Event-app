import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { PrismaService } from 'prisma/prisma.service';
import { UserWithProfileAndAddressDTO } from './dto/user-profile.dto';
import { mapUserProfileAddress } from './mapper/user-profile.mapper';
import { GeoapifyService } from 'src/geoapify/geoapify.service';
import { toGeocodeDto } from 'src/address/mapper/address.mapper';
import { Prisma } from 'prisma/generated/prisma/client';

/**
 * Type Prisma représentant la relation "Address" dans un create/update de UserProfile.
 *
 * Il correspond à une structure `connectOrCreate` permettant soit :
 * - de lier une adresse existante (connect)
 * - soit de créer une nouvelle adresse (create)
 *
 * On l’utilise ici pour éviter toute duplication de type entre DTO et Prisma,
 * et garantir la cohérence avec le schéma de base de données.
 */
type AddressConnectOrCreate =
    Prisma.AddressCreateNestedOneWithoutUser_profileInput;

@Injectable()
export class UserProfileService {
    private readonly includeUserAndAddress = {
        User: {
            select: {
                id: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true,
            },
        },
        Address: true,
    };

    constructor(
        private readonly prisma: PrismaService,
        private readonly geoapifyService: GeoapifyService,
    ) {}

    async create(
        userId: number,
        createUserProfileDto: CreateUserProfileDto,
    ): Promise<UserWithProfileAndAddressDTO> {
        const { profileData, addressData } =
            buildProfileData(createUserProfileDto);

        const enrichedAddress = await enrichAddressWithCoordinates(
            addressData,
            this.geoapifyService,
        );

        if (!profileData) throw new NotFoundException('error');

        const newProfile = await this.prisma.user_profile.create({
            data: {
                ...profileData,
                birthdate: profileData.birthdate
                    ? new Date(profileData.birthdate)
                    : null,
                User: { connect: { id: userId } },
                Address: enrichedAddress,
            },
            include: this.includeUserAndAddress,
        });

        return mapUserProfileAddress(newProfile);
    }

    async update(
        userId: number,
        updateUserProfileDto: UpdateUserProfileDto,
    ): Promise<UserWithProfileAndAddressDTO> {
        const { profileData, addressData } =
            buildProfileData(updateUserProfileDto);

        const enrichedAddress = await enrichAddressWithCoordinates(
            addressData,
            this.geoapifyService,
        );

        if (!profileData) throw new NotFoundException('Error');

        const updatedProfile = await this.prisma.user_profile.update({
            where: { user_id: userId },
            data: {
                ...profileData,
                birthdate: profileData.birthdate
                    ? new Date(profileData.birthdate)
                    : null,
                Address: enrichedAddress,
            },
            include: this.includeUserAndAddress,
        });

        return mapUserProfileAddress(updatedProfile);
    }

    async findUserWithProfile(
        userId: number,
    ): Promise<UserWithProfileAndAddressDTO | null> {
        const user = await this.prisma.user_profile.findUnique({
            where: { user_id: userId },
            include: this.includeUserAndAddress,
        });

        if (!user) return null;

        return mapUserProfileAddress(user);
    }

    async countProfileById(userId: number): Promise<number> {
        const user = await this.prisma.user_profile.count({
            where: { user_id: userId },
        });

        return user;
    }
}

export function buildProfileData(
    profile: CreateUserProfileDto | UpdateUserProfileDto,
) {
    const { address, ...profileData } = profile;

    return {
        profileData,
        addressData: address
            ? {
                  connectOrCreate: {
                      where: {
                          unique_address: {
                              street_number: address.street_number,
                              street_name: address.street_name,
                              city: address.city,
                              postal_code: address.postal_code,
                              country: address.country,
                          },
                      },
                      create: {
                          ...address,
                      },
                  },
              }
            : undefined,
    };
}

/**
 * Enrichit une adresse avec les coordonnées GPS via Geoapify.
 *
 * Cette fonction :
 * 1. Vérifie si une adresse "create" existe dans le connectOrCreate Prisma
 * 2. Transforme cette adresse au format Geoapify (toGeocodeDto)
 * 3. Appelle l'API Geoapify pour récupérer les coordonnées (lat/lon)
 * 4. Injecte ces coordonnées dans l'objet Prisma avant insertion en base
 *
 * ⚠️ Important :
 * - Cette fonction ne modifie pas une adresse existante en base
 * - Elle intervient uniquement lors de la création (connectOrCreate.create)
 * - Elle garantit que toute nouvelle adresse est géolocalisée automatiquement
 */
async function enrichAddressWithCoordinates(
    addressData: AddressConnectOrCreate | undefined,
    geoapifyService: GeoapifyService,
) {
    if (!addressData?.connectOrCreate?.create) return addressData;

    const geoAddress = toGeocodeDto(addressData.connectOrCreate.create);

    const coordinates = await geoapifyService.geocodeAddress(geoAddress);

    return {
        ...addressData,
        connectOrCreate: {
            ...addressData.connectOrCreate,
            create: {
                ...addressData.connectOrCreate.create,
                coordinates_lat: coordinates?.lat ?? null,
                coordinates_lon: coordinates?.lon ?? null,
            },
        },
    };
}
