import { z } from "zod";
import { availabilitySchema } from "./availability.contract";
import { notificationsSchema } from "./notification.contract";
import { preferencesSchema } from "./preferences.contract";

export const meSettingsSchema = z.object({
	profile: z.object({
		firstName: z.string(),
		lastName: z.string(),
		avatarUrl: z.string(),
		phone: z.string(),
		bio: z.string(),
		address: z.any(), // ou schema dédié
	}),

	security: z.object({
		twoFactorEnabled: z.boolean(),
	}),

	notifications: notificationsSchema,

	preferences: preferencesSchema,

	availability: availabilitySchema,
});

export type MeSettingsDto = z.infer<typeof meSettingsSchema>;
