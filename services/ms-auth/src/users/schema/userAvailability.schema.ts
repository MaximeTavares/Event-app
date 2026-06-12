import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class UserAvailability {
    @Prop({ default: true })
    monday: boolean;

    @Prop({ default: true })
    tuesday: boolean;

    @Prop({ default: true })
    wednesday: boolean;

    @Prop({ default: true })
    thursday: boolean;

    @Prop({ default: true })
    friday: boolean;

    @Prop({ default: true })
    saturday: boolean;

    @Prop({ default: true })
    sunday: boolean;
}
