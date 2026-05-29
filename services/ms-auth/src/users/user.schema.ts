import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { type Role } from 'src/type/auth.type';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    password?: string;

    @Prop({ default: 'USER' })
    role: Role;

    @Prop({
        type: {
            google: {
                sub: String,
            },
        },
        default: {},
    })
    providers: {
        google?: {
            sub: string;
        };
    };

    @Prop({
        type: {
            firstName: String,
            lastName: String,
            avatarUrl: String,
        },

        default: {},
    })
    profile: {
        firstName?: string;
        lastName?: string;
        avatarUrl?: string;
    };
}

export const UserSchema = SchemaFactory.createForClass(User);
