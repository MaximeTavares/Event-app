import { z } from 'zod';

export const availabilitySchema = z.object({
    monday: z.boolean(),
    tuesday: z.boolean(),
    wednesday: z.boolean(),
    thursday: z.boolean(),
    friday: z.boolean(),
    saturday: z.boolean(),
    sunday: z.boolean(),
});

export type AvailabilityDto = z.infer<typeof availabilitySchema>;
