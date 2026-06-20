import { SlotDomain } from '@app/contracts';
import { Prisma } from '@app/db';
import { BadRequestException } from '@nestjs/common';
import { SLOT_POLICY } from './slot.policy';

export function assertCanJoin(
    slot: SlotDomain,
    currentParticipants: number,
): void {
    const rules = SLOT_POLICY[slot.status];

    if (!rules.canJoin.allowed)
        throw new BadRequestException(
            rules.canJoin.errorMessage ?? 'Cannot joint slot',
        );

    if (currentParticipants >= slot.max_participant)
        throw new BadRequestException('Slot is full');
}

export async function syncSlotStatus(
    tx: Prisma.TransactionClient,
    slotId: number,
): Promise<void> {
    const slot = await tx.slot.findUnique({
        where: { id: slotId },
    });

    if (!slot) return;

    const acceptedCount = await tx.participation.count({
        where: { slot_id: slotId, status: 'ACCEPTED' },
    });

    const newStatus = acceptedCount >= slot.max_participant ? 'FULL' : 'OPEN';

    if (slot.status !== newStatus) {
        await tx.slot.update({
            where: { id: slotId },
            data: { status: newStatus },
        });
    }
}
