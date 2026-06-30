import { z } from "zod";
import { SLOT_STATUS } from "./slot.types.js";

export const SlotCreationSchema = z
	.object({
		status: z.enum(SLOT_STATUS),

		start_at: z.coerce.date(),
		end_at: z.coerce.date(),

		max_participant: z.coerce
			.number("Doit être un chiffre")
			.int("Doit être un entier.")
			.min(1, "Au moins 1 participant."),
	})
	.refine((data) => data.end_at > data.start_at, {
		message: "La date de fin doit être après la date de début",
		path: ["end_at"],
	});

export type SlotFormValues = z.infer<typeof SlotCreationSchema>;
export type SlotCreationInputValues = z.input<typeof SlotCreationSchema>;
export type SlotCreationOutputValues = z.output<typeof SlotCreationSchema>;
