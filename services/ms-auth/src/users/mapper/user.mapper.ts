import { Injectable } from '@nestjs/common';
import { PublicUserDto } from 'src/users/dto/user.dto';
import { UserDocument } from '../schema/user.schema';
import { UserProfile } from '../schema/userProfile.schema';
import { ProfileDto } from '@app/contracts';

@Injectable()
export class UserMapper {
    static toPublic(user: UserDocument): PublicUserDto {
        return {
            id: user._id.toString(),
            email: user.email,
            profile: user.profile,
            preferences: user.preferences,
            notifications: user.notifications,
            security: {
                twoFactorEnabled: user.security.twoFactorEnabled,
            },
            availability: user.availability,
        };
    }

    static toProfileDomain(dto: ProfileDto): UserProfile {
        return {
            firstName: dto.firstName,
            lastName: dto.lastName,
            bio: dto.bio,
            phone: dto.phone,
            avatarUrl: dto.avatarUrl,
            address: dto.address,
        };
    }

    static toProfileDto(dto: UserProfile): ProfileDto {
        return {
            firstName: dto.firstName ?? '',
            lastName: dto.lastName ?? '',
            bio: dto.bio,
            phone: dto.phone,
            avatarUrl: dto.avatarUrl,
            address: dto.address,
        };
    }
}
