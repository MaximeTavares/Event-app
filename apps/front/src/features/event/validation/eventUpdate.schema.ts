import { z } from "zod";

export const eventUpdateSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	program: z.string().optional(),

	start_date: z.string().optional(),
	end_date: z.string().optional(),

	status: z.enum(["DRAFT", "OPEN", "CLOSED", "CANCELLED"]).optional(),

	address: z
		.object({
			street_number: z.string().optional(),
			street_name: z.string().optional(),
			address_line_2: z.string().optional(),
			city: z.string().optional(),
			postal_code: z.string().optional(),
			country: z.string().optional(),
		})
		.optional(),
});

export type EventUpdateFormValues = z.infer<typeof eventUpdateSchema>;
