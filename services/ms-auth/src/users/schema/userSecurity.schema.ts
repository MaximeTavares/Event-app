import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class UserSecurity {
    @Prop({ default: false })
    twoFactorEnabled: boolean;

    @Prop()
    twoFactorSecret?: string;
}
