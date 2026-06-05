import { Prop, Schema } from '@nestjs/mongoose';
import { Address } from './address.schema';

@Schema({ _id: false })
export class UserProfile {
    @Prop()
    firstName?: string;

    @Prop()
    lastName?: string;

    @Prop()
    avatarUrl?: string;

    @Prop()
    phone?: string;

    @Prop()
    bio?: string;

    @Prop({
        type: Address,
        default: {},
    })
    address?: Address;
}
