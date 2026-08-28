import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { type Role } from 'src/type/auth.type';
import { UserNotifications } from './userNotifications.schema';
import { UserPreferences } from './userPreference.schema';
import { UserProfile } from './userProfile.schema';
import { UserProviders } from './userProvider.schema';
import { UserSecurity } from './userSecurity.schema';
import { UserAvailability } from './userAvailability.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    password?: string;

    @Prop({ type: String, default: 'USER' })
    role: Role;

    @Prop({
        type: UserProviders,
        default: {},
    })
    providers: UserProviders;

    @Prop({
        type: UserProfile,
        default: {},
    })
    profile: UserProfile;

    @Prop({
        type: UserPreferences,
        default: {},
    })
    preferences: UserPreferences;

    @Prop({
        type: UserNotifications,
        default: {},
    })
    notifications: UserNotifications;

    @Prop({
        type: UserAvailability,
        default: {},
    })
    availability: UserAvailability;

    @Prop({
        type: UserSecurity,
        default: {},
    })
    security: UserSecurity;
}

export const UserSchema = SchemaFactory.createForClass(User);
