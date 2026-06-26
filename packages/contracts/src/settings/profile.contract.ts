import { z } from "zod";

export const coordinatesSchema = z.object({
	lat: z.number(),
	lon: z.number(),
});

export const addressSchema = z.object({
	streetNumber: z.string().optional(),
	streetName: z.string().optional(),
	addressLine2: z.string().optional(),
	city: z.string().optional(),
	postalCode: z.string().optional(),
	country: z.string().optional(),
	coordinates: coordinatesSchema.optional(),
});

export const profileSchema = z
	.object({
		firstName: z.string().trim().min(1, "Le prénom est requis."),

		lastName: z.string().trim().min(1, "Le nom est requis."),

		avatarUrl: z.string().optional().or(z.literal("")),

		phone: z
			.string()
			.regex(/^[0-9+().\s-]{6,20}$/, "Numéro invalide")
			.optional(),

		bio: z.string().max(1000, "La biographie est trop longue.").optional(),

		address: addressSchema.optional(),
	})
	.superRefine((data, ctx) => {
		if (!data.address) return;

		const { coordinates, ...addressTextFields } = data.address;

		const hasAddressData = Object.values(addressTextFields).some(
			(value) => value && value.trim() !== "",
		);

		if (!hasAddressData) return;

		const requiredFields = [
			"streetNumber",
			"streetName",
			"city",
			"postalCode",
			"country",
		] as const;

		for (const field of requiredFields) {
			if (!data.address[field]?.trim()) {
				ctx.addIssue({
					code: "custom",
					path: ["address", field],
					message: "Ce champ est requis.",
				});
			}
		}
	});

export type ProfileFormValues = z.input<typeof profileSchema>;
export type ProfileDto = z.infer<typeof profileSchema>;
