import {
    Participation_status,
    Slot_status,
} from 'prisma/generated/prisma/enums';

export type SlotDTO = {
    id: number;
    start_at: Date;
    end_at: Date;
    max_participants: number;
    current_participants: number;
    available_place: number;
    status: Slot_status;
};

export type SlotWithParticipations = {
    id: number;
    mission_id: number;
    status: Slot_status;
    start_at: Date;
    end_at: Date;
    max_participant: number;
    Mission: {
        Event: {
            user_id: number;
        };
    };
    Participation: {
        id: number;
        status: Participation_status;
        User: {
            id: number;
            email: string;
            User_profile: {
                first_name: string | null;
                last_name: string | null;
            } | null;
        };
    }[];
};

export type SlotWithParticipationDto = {
    id: number;
    organizer_id: number;
    start_at: Date;
    end_at: Date;
    max_participants: number;
    current_participants: number;
    available_place: number;
    status: Slot_status;
    participants: {
        id: number;
        participation_id: number;
        first_name: string | null;
        last_name: string | null;
        email: string;
        participation_status: Participation_status;
    }[];
};
