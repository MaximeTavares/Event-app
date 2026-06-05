import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class UserPreferences {
    @Prop({ default: 'fr' })
    language: string;

    @Prop({ default: 'events_only' })
    profileVisibility: string;

    @Prop({ default: false })
    showEmail: boolean;

    @Prop({ default: false })
    showPhone: boolean;
}
