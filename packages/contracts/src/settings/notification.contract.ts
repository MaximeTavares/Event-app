import { z } from 'zod';

export const notificationsSchema = z.object({
    enabled: z.boolean(),
    eventActivity: z.boolean(),
    eventMessages: z.boolean(),
    documents: z.boolean(),
    deadlines: z.boolean(),
    nearbyEvents: z.boolean(),
    judgments: z.boolean(),
});

export type NotificationsDto = z.infer<typeof notificationsSchema>;