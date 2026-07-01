import { Prop, Schema } from '@nestjs/mongoose';
import {
    FONT_SIZES,
    TIME_FORMATS,
    DATE_FORMATS,
    DISTANCE_UNITS,
    LANGUAGES,
    PROFILE_VISIBILITIES,
} from '@app/contracts';

@Schema({ _id: false })
export class UserPreferences {
    @Prop({
        type: String,
        enum: FONT_SIZES,
        default: 'md',
    })
    fontSize: (typeof FONT_SIZES)[number];

    @Prop({ type: Boolean, default: false })
    highContrast: boolean;

    @Prop({
        type: String,
        enum: TIME_FORMATS,
        default: '24',
    })
    timeFormat: (typeof TIME_FORMATS)[number];

    @Prop({
        type: String,
        enum: DATE_FORMATS,
        default: 'eu',
    })
    dateFormat: (typeof DATE_FORMATS)[number];

    @Prop({
        type: String,
        enum: DISTANCE_UNITS,
        default: 'km',
    })
    distanceUnit: (typeof DISTANCE_UNITS)[number];

    @Prop({
        type: String,
        enum: LANGUAGES,
        default: 'fr',
    })
    language: (typeof LANGUAGES)[number];

    @Prop({
        type: String,
        enum: PROFILE_VISIBILITIES,
        default: 'events_only',
    })
    profileVisibility: (typeof PROFILE_VISIBILITIES)[number];

    @Prop({ type: Boolean, default: false })
    showEmail: boolean;

    @Prop({ type: Boolean, default: false })
    showPhone: boolean;

    @Prop({ type: String, default: 'month' })
    defaultCalendarView: string;

    @Prop({ type: String, default: '' })
    defaultSearchCity: string;
}
