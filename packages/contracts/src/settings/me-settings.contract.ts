import { z } from "zod";
import { availabilitySchema } from "./availability.contract.js";
import { notificationsSchema } from "./notification.contract.js";
import { preferencesSchema } from "./preferences.contract.js";
import { addressSchema } from "./profile.contract.js";

export const meSettingsSchema = z.object({
	profile: z.object({
		firstName: z.string(),
		lastName: z.string(),
		avatarUrl: z.string(),
		phone: z.string(),
		bio: z.string(),
		address: addressSchema,
	}),

	security: z.object({
		twoFactorEnabled: z.boolean(),
	}),

	notifications: notificationsSchema,

	preferences: preferencesSchema,

	availability: availabilitySchema,
});

export type MeSettingsDto = z.infer<typeof meSettingsSchema>;

export type SettingsList = 'profile' | 'security' | 'notifications' | 'preferences' | 'availability'
