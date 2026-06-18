import { SlotStatus } from '@app/contracts';

interface SlotPolicy {
    canJoin: {
        allowed: boolean;
        errorMessage?: string;
    };
}

export const SLOT_POLICY: Record<SlotStatus, SlotPolicy> = {
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
