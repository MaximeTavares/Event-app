import { Injectable } from '@nestjs/common';
import { PublicUserDto } from 'src/users/dto/user.dto';
import { UserDocument } from '../schema/user.schema';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UpdateProfileDomain } from '../domain/update-profile.domain';

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

    static toProfileDomain(dto: UpdateProfileDto): UpdateProfileDomain {
        return {
            profile: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                bio: dto.bio,
                phone: dto.phone,
                avatarUrl: dto.avatarUrl,
                address: dto.address,
            },
        };
    }
}
