import { UserMapper } from './mapper/user.mapper';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, UpdateQuery } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import {
    AvailabilityDto,
    NotificationsDto,
    PreferencesDto,
    ProfileDto,
    SecurityDto,
} from '@app/contracts';
import { UserProfile } from './schema/userProfile.schema';

type SimpleSettingsSection =
    | 'availability'
    | 'preferences'
    | 'notifications'
    | 'security';

interface SettingsFieldMap {
    availability: AvailabilityDto;
    preferences: PreferencesDto;
    notifications: NotificationsDto;
    security: SecurityDto;
}
@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}

    async findByEmail(email: string) {
        return this.userModel.findOne({ email });
    }

    async findById(id: string) {
        const user = await this.userModel.findById(id);

        if (!user)
            throw new RpcException({
                message: "Cette utilisateur n'existe pas ",
                code: 404,
            });

        return user;
    }

    async findManyByIds(userIds: string[]) {
        const users = await this.userModel
            .find({
                _id: {
                    $in: userIds,
                },
            })
            .lean()
            .exec();

        return users.map((user) => ({
            id: user._id.toString(),
            email: user.email,
            first_name: user.profile.firstName,
            last_name: user.profile.lastName,
            avatar_url: user.profile.avatarUrl,
        }));
    }

    async findAll() {
        return this.userModel.find();
    }

    async create(data: Partial<User>) {
        return this.userModel.create(data);
    }

    async findOrCreateGoogleUser(data: {
        email: string;
        googleSub: string;
        firstName?: string;
        lastName?: string;
        avatarUrl?: string;
    }) {
        const user = await this.userModel.findOne({ email: data.email });

        if (!user) {
            const newUser = await this.userModel.create({
                email: data.email,
                providers: {
                    google: {
                        sub: data.googleSub,
                    },
                },
                profile: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    avatarUrl: data.avatarUrl,
                },
            });

            return newUser;
        }
        return user;
    }

    async findSettingsSection<K extends SimpleSettingsSection>(
        userId: string,
        section: K,
    ): Promise<SettingsFieldMap[K]> {
        const user = await this.userModel.findById(userId);

        if (!user)
            throw new RpcException({
                message: "Cette utilisateur n'existe pas ",
                code: 404,
            });

        return user[section];
    }

    async updateSettingsSection<K extends SimpleSettingsSection>(
        userId: string,
        section: K,
        data: SettingsFieldMap[K],
    ): Promise<SettingsFieldMap[K]> {
        const updated = await this.updateById(userId, {
            [section]: data,
        });

        if (!updated)
            throw new RpcException({
                message: "Cette utilisateur n'existe pas ",
                code: 404,
            });

        return updated[section];
    }

    // PROFILE
    async findProfileById(id: string): Promise<ProfileDto> {
        const user = await this.userModel.findById(id);

        if (!user)
            throw new RpcException({
                message: "Cette utilisateur n'existe pas ",
                code: 404,
            });

        return UserMapper.toProfileDto(user.profile);
    }

    async updateProfile(
        userId: string,
        data: UserProfile,
    ): Promise<ProfileDto> {
        if (!data) throw new RpcException('Error');

        const updated = await this.updateById(userId, {
            profile: data,
        });

        if (!updated) {
            throw new RpcException('User not found');
        }

        return UserMapper.toProfileDto(updated?.profile);
    }

    async updateById(userId: string, update: UpdateQuery<User>) {
        return this.userModel.findByIdAndUpdate(
            userId,
            { $set: update },
            {
                returnDocument: 'after',
                runValidators: true,
            },
        );
    }
}
