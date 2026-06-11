import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, UpdateQuery } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { UpdateProfileDomain } from './domain/update-profile.domain';
import {
    AvailabilityDto,
    NotificationsDto,
    PreferencesDto,
    SecurityDto,
} from '@app/contracts';

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

    async updateProfile(
        userId: string,
        data: UpdateProfileDomain,
    ): Promise<void> {
        if (!data.profile) throw new RpcException('Error');

        await this.updateById(userId, {
            profile: data.profile,
        });
    }

    async updateAvailability(
        userId: string,
        data: AvailabilityDto,
    ): Promise<void> {
        if (!data) throw new RpcException('Error');

        await this.updateById(userId, {
            availability: data,
        });
    }

    async updatePreferences(
        userId: string,
        data: PreferencesDto,
    ): Promise<void> {
        if (!data) throw new RpcException('Error');

        await this.updateById(userId, {
            preferences: data,
        });
    }

    async updateNotifications(
        userId: string,
        data: NotificationsDto,
    ): Promise<void> {
        if (!data) throw new RpcException('Error');

        await this.updateById(userId, {
            notifications: data,
        });
    }

    async updateSecurity(userId: string, data: SecurityDto): Promise<void> {
        if (!data) throw new RpcException('Error');

        await this.updateById(userId, {
            security: data,
        });
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
