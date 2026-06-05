import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class UserNotifications {
    @Prop({ default: true })
    enabled: boolean;

    @Prop({ default: true })
    eventActivity: boolean;

    @Prop({ default: true })
    eventMessages: boolean;

    @Prop({ default: true })
    documents: boolean;

    @Prop({ default: true })
    deadlines: boolean;
}
