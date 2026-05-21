import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthUserDocument = HydratedDocument<RefreshToken>;

@Schema()
export class RefreshToken {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    tokenHash: string;

    @Prop({ required: true })
    expiresAt: Date;

    @Prop({ default: false })
    revoked: boolean;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
