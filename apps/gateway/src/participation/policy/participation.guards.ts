import { ParticipantDto, ParticipationStatus } from '@app/contracts';
import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
} from '@nestjs/common';
import { ParticipationWithStatusAndOrganizer } from '../type/participation.types';

export function assertFromStatus(
    p: ParticipationWithStatusAndOrganizer,
    allowed: ParticipationStatus[],
    message: string,
) {
    if (!allowed.includes(p.status)) throw new BadRequestException(message);
}

export function assertOrganizer(
    userId: string,
    p: ParticipationWithStatusAndOrganizer,
) {
    if (userId !== p.event.organizerId)
        throw new ForbiddenException('Only organizer can accept or reject');
}

export function assertOwner(
    userId: string,
    p: ParticipationWithStatusAndOrganizer,
) {
    if (userId !== p.userId)
        throw new ForbiddenException(
            'You can only cancel your own participations',
        );
}

export function assertCanCreateOrRejoin(
    participation: ParticipantDto | null,
): void {
    if (!participation) return;

    if (participation.status === 'CANCELLED') return;

    throw new ConflictException('Already registered');
}
