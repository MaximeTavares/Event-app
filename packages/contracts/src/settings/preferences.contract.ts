import { z } from 'zod';

export const preferencesSchema = z.object({
    fontSize: z.enum(['sm', 'md', 'lg']),

    highContrast: z.boolean(),

    timeFormat: z.enum(['24', '12']),

    dateFormat: z.enum(['eu', 'us']),

    distanceUnit: z.enum(['km', 'mi']),

    language: z.enum(['fr', 'en']),

    profileVisibility: z.enum(['public', 'events_only', 'organizers_only']),

    showEmail: z.boolean(),

    showPhone: z.boolean(),

    defaultCalendarView: z.string(),

    defaultSearchCity: z.string().default(''),
});

export type PreferencesDto = z.infer<typeof preferencesSchema>;
