import { Slot_status } from 'prisma/generated/prisma/enums';

type SlotPolicy = {
    canJoin: {
        allowed: boolean;
        errorMessage?: string;
    };
};

export const SLOT_POLICY: Record<Slot_status, SlotPolicy> = {
    FULL: {
        canJoin: {
            allowed: false,
            errorMessage: 'Slot is full',
        },
    },
    OPEN: {
        canJoin: {
            allowed: true,
        },
    },
    CLOSED: {
        canJoin: {
            allowed: false,
            errorMessage: 'Slot is closed',
        },
    },
    CANCELLED: {
        canJoin: {
            allowed: false,
            errorMessage: 'Slot is cancelled',
        },
    },
};
