import {
    ForbiddenException,
    BadRequestException,
    Injectable,
    ConflictException,
} from '@nestjs/common';
import { ParticipationWithStatusAndOrganizer } from '../type/participation.types';
import { PARTICIPATION_POLICY } from './participations.policy';
import { ParticipationDTO } from '../dto/participation.dto';

@Injectable()
export class ParticipationPolicyService {
    assertCanAccept(
        userId: number,
        participation: ParticipationWithStatusAndOrganizer,
    ): void {
        this.assertOrganizer(userId, participation);

        const rules = PARTICIPATION_POLICY[participation.status];

        if (!rules.CanBeValidateByOrganizer.allowed)
            throw new BadRequestException(
                rules.CanBeValidateByOrganizer.errorMessage ??
                    'Cannot accept this participation',
            );
    }

    assertCanReject(
        userId: number,
        participation: ParticipationWithStatusAndOrganizer,
    ): void {
        this.assertOrganizer(userId, participation);

        const rules = PARTICIPATION_POLICY[participation.status];

        if (!rules.CanBeValidateByOrganizer.allowed)
            throw new BadRequestException(
                rules.CanBeValidateByOrganizer.errorMessage ??
                    'Cannot reject this participation',
            );
    }

    assertCanCancel(
        userId: number,
        participation: ParticipationWithStatusAndOrganizer,
    ): void {
        if (userId !== participation.userId)
            throw new ForbiddenException(
                'You can only cancel your own participations',
            );

        const rules = PARTICIPATION_POLICY[participation.status];

        if (!rules.CanBeCancelByUser.allowed)
            throw new BadRequestException(
                rules.CanBeCancelByUser.errorMessage ??
                    'Cannot cancel this participation',
            );
    }

    assertCanCreateOrRejoin(participation: ParticipationDTO | null): void {
        if (!participation) return;

        if (participation.status === 'CANCELLED') return;

        throw new ConflictException('Already registered');
    }

    private assertOrganizer(
        currentUserId: number,
        participation: ParticipationWithStatusAndOrganizer,
    ): void {
        if (currentUserId !== participation.event.organizerId)
            throw new ForbiddenException('Only organizer can accept or reject');
    }
}
