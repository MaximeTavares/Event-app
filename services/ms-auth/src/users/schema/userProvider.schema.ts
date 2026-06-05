import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class UserProviders {
    @Prop({
        type: {
            sub: String,
        },
    })
    google?: {
        sub: string;
    };
}
