import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { UserProfileService } from 'src/user-profile/user-profile.service';
import { UserService } from 'src/user/user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { type MeSettingsDto, WEEK_DAYS } from './dto/me-settings.dto';
import { PatchProfileDto, PatchSettingsDto } from './dto/patch-settings.dto';
import { mapMeSettings } from './mapper/settings.mapper';
import {
    isTemplateAvailability,
    normalizeAvailabilityPatch,
    templateSlotRange,
} from './utils/availability.util';

@Injectable()
export class SettingsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly userProfileService: UserProfileService,
        private readonly authService: AuthService,
    ) {}

    async getForUser(userId: number): Promise<MeSettingsDto> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                User_profile: {
                    include: { Address: true },
                },
            },
        });

        if (!user) {
            throw new NotFoundException('Utilisateur introuvable.');
        }

        const availabilities = await this.prisma.availability.findMany({
            where: { user_id: userId },
            select: { start_at: true },
        });

        return mapMeSettings(user, availabilities);
    }

    async patchForUser(
        userId: number,
        patch: PatchSettingsDto,
    ): Promise<MeSettingsDto> {
        if (patch.profile) {
            await this.applyProfilePatch(userId, patch.profile);
        }

        if (patch.availability) {
            await this.applyAvailabilityPatch(
                userId,
                normalizeAvailabilityPatch(patch.availability),
            );
        }

        return this.getForUser(userId);
    }

    async changePassword(
        userId: number,
        dto: ChangePasswordDto,
    ): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { password_hash: true },
        });

        if (!user) {
            throw new NotFoundException('Utilisateur introuvable.');
        }

        const valid = await this.authService.compare(
            dto.currentPassword,
            user.password_hash,
        );

        if (!valid) {
            throw new UnauthorizedException('Mot de passe actuel incorrect.');
        }

        const hashed = await this.authService.hash(dto.newPassword);
        await this.userService.update(userId, { password: hashed });
    }

    private async applyProfilePatch(
        userId: number,
        profile: PatchProfileDto,
    ): Promise<void> {
        if (profile.email) {
            await this.userService.validateEmail(userId, profile.email);
            await this.userService.update(userId, { email: profile.email });
        }

        const hasProfileFields =
            profile.firstName !== undefined ||
            profile.lastName !== undefined ||
            profile.skills !== undefined ||
            profile.address !== undefined;

        if (!hasProfileFields) return;

        const profileCount =
            await this.userProfileService.countProfileById(userId);

        const addressPayload = this.resolveAddressPayload(profile.address);

        const profilePayload = {
            ...(profile.firstName !== undefined && {
                first_name: profile.firstName,
            }),
            ...(profile.lastName !== undefined && {
                last_name: profile.lastName,
            }),
            ...(profile.skills !== undefined && { bio: profile.skills }),
            ...(addressPayload !== undefined && { address: addressPayload }),
        };

        if (!profileCount) {
            await this.userProfileService.create(userId, profilePayload);
            return;
        }

        await this.userProfileService.update(userId, profilePayload);
    }

    private resolveAddressPayload(
        address?: CreateAddressDto,
    ): CreateAddressDto | undefined {
        if (address === undefined) return undefined;

        const hasValue = [
            address.street_number,
            address.street_name,
            address.city,
            address.postal_code,
            address.country,
        ].some((value) => value && String(value).trim() !== '');

        if (!hasValue) return undefined;

        return address;
    }

    private async applyAvailabilityPatch(
        userId: number,
        availability: MeSettingsDto['availability'],
    ): Promise<void> {
        const existing = await this.prisma.availability.findMany({
            where: { user_id: userId },
        });

        const templateIds = existing
            .filter((row) => isTemplateAvailability(row.start_at))
            .map((row) => row.id);

        if (templateIds.length > 0) {
            await this.prisma.availability.deleteMany({
                where: { id: { in: templateIds } },
            });
        }

        const now = new Date();
        const toCreate = WEEK_DAYS.filter((day) => availability[day]).map(
            (day) => {
                const { start_at, end_at } = templateSlotRange(day);
                return {
                    user_id: userId,
                    start_at,
                    end_at,
                    created_at: now,
                };
            },
        );

        if (toCreate.length > 0) {
            await this.prisma.availability.createMany({ data: toCreate });
        }
    }
}
