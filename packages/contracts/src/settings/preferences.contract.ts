import { z } from "zod";

export const FONT_SIZES = ["sm", "md", "lg"] as const;
export const TIME_FORMATS = ["24", "12"] as const;
export const DATE_FORMATS = ["eu", "us"] as const;
export const DISTANCE_UNITS = ["km", "mi"] as const;
export const LANGUAGES = ["fr", "en"] as const;
export const PROFILE_VISIBILITIES = ["public", "events_only", "organizers_only"] as const;

export const preferencesSchema = z.object({
	fontSize: z.enum(FONT_SIZES),

	highContrast: z.boolean(),

	timeFormat: z.enum(TIME_FORMATS),

	dateFormat: z.enum(DATE_FORMATS),

	distanceUnit: z.enum(DISTANCE_UNITS),

	language: z.enum(LANGUAGES),

	profileVisibility: z.enum(PROFILE_VISIBILITIES),

	showEmail: z.boolean(),

	showPhone: z.boolean(),

	defaultCalendarView: z.string(),

	defaultSearchCity: z.string(),
});

export type PreferencesDto = z.infer<typeof preferencesSchema>;
