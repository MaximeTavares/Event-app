import { ParticipationPolicyService } from './participationPolicy.service.';
import { ParticipationWithStatusAndOrganizer } from '../type/participation.types';
import { Participation_status } from '../../../prisma/generated/prisma/client';

type ParticipationPolicy = {
    CanBeCancelByUser: { allowed: boolean; errorMessage?: string };
    CanBeValidateByOrganizer: { allowed: boolean; errorMessage?: string };
};

export const PARTICIPATION_POLICY: Record<
    Participation_status,
    ParticipationPolicy
> = {
    ACCEPTED: {
        CanBeCancelByUser: {
            allowed: true,
        },
        CanBeValidateByOrganizer: {
            allowed: false,
            errorMessage: 'Already accepted',
        },
    },
    REJECTED: {
        CanBeCancelByUser: {
            allowed: false,
            errorMessage: "You're participation has already been rejected",
        },
        CanBeValidateByOrganizer: {
            allowed: false,
            errorMessage: 'Already rejected',
        },
    },
    PENDING: {
        CanBeCancelByUser: {
            allowed: true,
        },
        CanBeValidateByOrganizer: {
            allowed: true,
        },
    },
    CANCELLED: {
        CanBeCancelByUser: {
            allowed: false,
            errorMessage: 'Already cancelled',
        },
        CanBeValidateByOrganizer: {
            allowed: false,
            errorMessage: 'This participation has been cancelled',
        },
    },
};

export const PARTICIPATION_ACTION_CONFIG = {
    ACCEPT: {
        status: 'ACCEPTED',
        applyPolicy: (
            policy: ParticipationPolicyService,
            userId: number,
            participation: ParticipationWithStatusAndOrganizer,
        ) => policy.assertCanAccept(userId, participation),
        decision_at: () => new Date(),
        cancelled_at: () => null,
    },
    REJECT: {
        status: 'REJECTED',
        applyPolicy: (
            policy: ParticipationPolicyService,
            userId: number,
            participation: ParticipationWithStatusAndOrganizer,
        ) => policy.assertCanReject(userId, participation),
        decision_at: () => new Date(),
        cancelled_at: () => null,
    },
    CANCEL: {
        status: 'CANCELLED',
        applyPolicy: (
            policy: ParticipationPolicyService,
            userId: number,
            participation: ParticipationWithStatusAndOrganizer,
        ) => policy.assertCanCancel(userId, participation),
        decision_at: () => null,
        cancelled_at: () => new Date(),
    },
} as const;
