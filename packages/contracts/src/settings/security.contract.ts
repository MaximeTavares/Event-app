import z from "zod";

export const SecuritySchema = z.object({
	twoFactorEnabled: z.boolean(),
});

export type SecurityDto = z.infer<typeof SecuritySchema>;
