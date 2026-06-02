import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}

    async findByEmail(email: string) {
        return this.userModel.findOne({ email });
    }

    async findById(id: string) {
        return this.userModel.findById(id);
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
}
