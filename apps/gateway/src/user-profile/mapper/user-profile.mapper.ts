import { differenceInYears } from 'date-fns';
import { Address, User, User_profile } from 'prisma/generated/prisma/client';
import { mapUser } from 'src/user/mapper/user.mapper';
import {
    UserProfileDTO,
    UserWithProfileAndAddressDTO,
} from '../dto/user-profile.dto';

export function mapProfile(profile: User_profile): UserProfileDTO {
    //Calcul full_name
    const full_name = `${profile.first_name} ${profile.last_name}`;

    //Calcul Age
    const now = new Date();
    const birthdate = profile?.birthdate;
    const age = birthdate ? differenceInYears(now, birthdate) : null;

    return {
        full_name: full_name,
        age: age,
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone_number: profile.phone_number,
        birthdate: profile.birthdate,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
    };
}

export function mapUserProfileAddress(
    profile: User_profile & {
        User: Omit<User, 'password_hash'>;
        Address: Address | null;
    },
): UserWithProfileAndAddressDTO {
    return {
        user: mapUser(profile.User),
        profile: mapProfile(profile),
        address: profile.Address,
    };
}
