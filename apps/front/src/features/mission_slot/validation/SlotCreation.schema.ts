import { z } from 'zod';

export const SlotCreationSchema = z
    .object({
        status: z.enum(['OPEN', 'CANCELLED', 'FULL', 'CLOSED']),

        start_at: z.coerce.date(),
        end_at: z.coerce.date(),

        max_participant: z.coerce
            .number('Doit être un chiffre')
            .int('Doit être un entier.')
            .min(1, 'Au moins 1 participant.'),
    })
    .refine((data) => data.end_at > data.start_at, {
        message: 'La date de fin doit être après la date de début',
        path: ['end_at'],
    });

export type SlotCreationInputValues = z.input<typeof SlotCreationSchema>;
export type SlotCreationOutputValues = z.output<typeof SlotCreationSchema>;
