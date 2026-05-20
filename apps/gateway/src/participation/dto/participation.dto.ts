import { Participation_status } from 'prisma/generated/prisma/enums';

export type ParticipationDTO = {
    id: number;
    user_id: number;
    slot_id: number;
    status: Participation_status;
    decision_at: Date | null;
    cancelled_at: Date | null;
    created_at: Date;
    updated_at: Date | null;
};
