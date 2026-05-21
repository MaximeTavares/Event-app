import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthUserDocument = HydratedDocument<AuthUser>;

@Schema({ timestamps: true })
export class AuthUser {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    roles: string[];
}

export const AuthUserSchema = SchemaFactory.createForClass(AuthUser);
