import { z } from "zod";

export const addressSchema = z.object({
	street_number: z.string().min(1, "Le numéro de rue est requis"),
	street_name: z.string().min(1, "Le nom de rue est requis"),
	address_line_2: z.string().optional(),
	city: z.string().min(1, "La ville est requise"),
	postal_code: z.string().min(1, "Le code postal est requis"),
	country: z.string().min(1, "Le pays est requis"),
});

export const eventCreationSchema = z
	.object({
		title: z.string().min(1, "Le titre est requis"),
		description: z.string().min(1, "La description est requise"),
		program: z.string().min(1, "Le programme est requis"),

		start_date: z.string(),
		end_date: z.string(),

		address: addressSchema,

		status: z.enum(["DRAFT", "OPEN", "CLOSED", "CANCELLED"]),
	})
	.refine((data) => data.end_date >= data.start_date, {
		message: "La date de fin doit être après la date de début",
		path: ["end_date"],
	});

export type EventCreationFormValues = z.infer<typeof eventCreationSchema>;
