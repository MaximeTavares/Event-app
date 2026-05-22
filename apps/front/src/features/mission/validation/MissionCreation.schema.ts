import z from 'zod';
import { MISSION_STATUS } from '../types/mission.type';

export const MissionCreationSchema = z.object({
    title: z.string().min(1, 'Le titre est requis'),
    description: z.string().min(1, 'La description est requise'),
    status: z.enum(MISSION_STATUS),
});

export type MissionCreationFormValues = z.infer<typeof MissionCreationSchema>;
