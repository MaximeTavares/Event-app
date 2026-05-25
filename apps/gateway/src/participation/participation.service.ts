import { SlotMapper } from './../slot/dto/mapper/slot.mapper';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ParticipationWithStatusAndOrganizer } from './type/participation.types';
import { ParticipationDTO } from './dto/participation.dto';
import { SlotDTO } from 'src/slot/dto/slot.dto';
import { EventDTO } from 'src/event/dto/event.dto';
import { ParticipationPolicyService } from './policy/participationPolicy.service.';
import { SlotPolicyService } from './policy/slotPolicy.service';
import { UpdateParticipationDto } from './dto/update-participation.dto';
import { PARTICIPATION_ACTION_CONFIG } from './policy/participations.policy';
import { Mission, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ParticipationService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly participationPolicy: ParticipationPolicyService,
        private readonly slotPolicy: SlotPolicyService,
    ) {}

    /**
     * Create a participation on a slot :
     *  - Check if slot exist
     *  - Check if slot is full
     *  - Check is the user is already registered
     *  - Update if the participation has been cancelled
     *
     * We use transaction because we need that all check pass for the
     * creation of the participation (Important for the count of the
     * current participants)
     *
     * @param currentUserId The currently logged-in User
     * @param slotId The slot of a mission
     * @returns Creation of a participation in "Pending" state
     */
    async create(
        currentUserId: number,
        slotId: number,
    ): Promise<ParticipationDTO> {
        return await this.prisma.$transaction(async (tx) => {
            //Check if slot exist
            const slot = await this.getSlotOrThrow(tx, slotId);

            //Get currentParticipants and Check if already registered
            const { existing, currentParticipants } = await this.getSlotContext(
                tx,
                slotId,
                currentUserId,
            );

            //Policies
            this.participationPolicy.assertCanCreateOrRejoin(existing);
            this.slotPolicy.assertCanJoin(slot, currentParticipants);

            //Update or Create participation
            const participation = await this.createOrRejointParticipation(
                tx,
                currentUserId,
                slotId,
                existing,
            );

            return participation;
        });
    }

    private async getSlotOrThrow(tx: Prisma.TransactionClient, slotId: number) {
        //Check if slot exist
        const slot = await tx.slot.findUnique({
            where: { id: slotId },
        });

        if (!slot) throw new NotFoundException('Slot not found');

        return slot;
    }

    private async getSlotContext(
        tx: Prisma.TransactionClient,
        slotId: number,
        currentUserId: number,
    ) {
        //Count currentParticipants
        const currentParticipants = await tx.participation.count({
            where: { slot_id: slotId, status: 'ACCEPTED' },
        });

        //Check if user is already registered
        const existing = await tx.participation.findUnique({
            where: {
                unique_user_slot: {
                    user_id: currentUserId,
                    slot_id: slotId,
                },
            },
        });

        return { existing, currentParticipants };
    }

    private async createOrRejointParticipation(
        tx: Prisma.TransactionClient,
        currentUserId: number,
        slotId: number,
        existing: ParticipationDTO | null,
    ) {
        //Update existing participation with status "CANCELLED"
        if (existing?.status === 'CANCELLED') {
            return tx.participation.update({
                where: {
                    unique_user_slot: {
                        user_id: currentUserId,
                        slot_id: slotId,
                    },
                },
                data: {
                    status: 'PENDING',
                    decision_at: null,
                    cancelled_at: null,
                },
            });
        }

        //Create  participation
        return await tx.participation.create({
            data: {
                user_id: currentUserId,
                slot_id: slotId,
                status: 'PENDING',
            },
        });
    }

    async findAll(): Promise<ParticipationDTO[]> {
        return await this.prisma.participation.findMany();
    }

    async findOne(id: number): Promise<ParticipationDTO> {
        const participation = await this.prisma.participation.findUnique({
            where: { id },
        });

        if (!participation)
            throw new NotFoundException('Participation not found');

        return participation;
    }

    async getMyParticipations(userId: number): Promise<ParticipationDTO[]> {
        const participations = await this.prisma.participation.findMany({
            where: { user_id: userId },
        });

        if (participations.length === 0)
            throw new NotFoundException("You don't have any participations");

        return participations;
    }

    /**
     * Retrieve all slots in which the user is participating.
     *
     * This method returns a list of slots associated with the connected user,
     * enriched with the number of accepted participants and remaining 
	 * available places.
     *
     * The participant count is calculated using a grouped query.
     *
     * @param userId - The User currently logged-in.
     *
     * @throws {NotFoundException} If no slots are found (optional, depending on your implementation)
    
     */
    async getMySlots(userId: number): Promise<SlotDTO[]> {
        const participations = await this.prisma.participation.findMany({
            where: { user_id: userId },
            select: {
                Slot: {
                    select: {
                        id: true,
                        start_at: true,
                        end_at: true,
                        max_participant: true,
                        status: true,
                    },
                },
            },
        });

        if (participations.length === 0)
            throw new NotFoundException('No participations found');

        const slots = participations.map((p) => p.Slot);
        const slotIds = slots.map((s) => s.id);

        /**
         * Computes the number of accepted participants per slot.
         *
         * This query groups all participations by slot_id and counts
         * how many users have an "ACCEPTED" status for each slot.
         *
         *
         * Only slots included in the provided slotIds array are used.
         *
         * @param slotIds - Array of slot IDs to compute participant counts for
         *
         * @returns An array of grouped results where each entry contains:
         * - slot_id: the slot id
         * - _count.slot_id: number of accepted participants for that slot
         *
         * @example
         * const counts = await prisma.participation.groupBy({
         *   by: ['slot_id'],
         *   where: {
         *     slot_id: { in: slotIds },
         *     status: 'ACCEPTED',
         *   },
         *   _count: {
         *     slot_id: true,
         *   },
         * });
         *
         * // Result:
         * // [
         * //   { slot_id: 1, _count: { slot_id: 3 } },
         * //   { slot_id: 2, _count: { slot_id: 5 } }
         * // ]
         */
        const counts = await this.prisma.participation.groupBy({
            by: ['slot_id'],
            where: {
                slot_id: { in: slotIds },
                status: 'ACCEPTED',
            },
            _count: {
                slot_id: true,
            },
        });

        const countMap = new Map<number, number>();
        counts.forEach((c) => {
            countMap.set(c.slot_id, c._count.slot_id);
        });

        return slots.map((slot) =>
            SlotMapper.MapSlot(slot, countMap.get(slot.id) ?? 0),
        );
    }

    private uniqueBy<T, K extends keyof T>(items: T[], key: K) {
        const itemMap = new Map<T[K], T>();
        items.forEach((item) => {
            itemMap.set(item[key], item);
        });

        return [...itemMap.values()];
    }

    async getMyMissions(userId: number): Promise<Mission[]> {
        const participations = await this.prisma.participation.findMany({
            where: { user_id: userId },
            select: {
                Slot: {
                    select: {
                        Mission: true,
                    },
                },
            },
        });

        if (participations.length === 0)
            throw new NotFoundException("You don't have any participations");

        return this.uniqueBy(
            participations.map((p) => p.Slot.Mission),
            'id',
        );
    }

    async getMyEvents(
        userId: number,
    ): Promise<Omit<EventDTO, 'user' | 'address'>[]> {
        const participations = await this.prisma.participation.findMany({
            where: { user_id: userId },
            select: {
                Slot: {
                    select: {
                        Mission: {
                            select: {
                                Event: true,
                            },
                        },
                    },
                },
            },
        });

        if (participations.length === 0)
            throw new NotFoundException("You don't have any participations");

        return this.uniqueBy(
            participations.map((p) => p.Slot.Mission.Event),
            'id',
        );
    }

    async acceptParticipation(
        currentUserId: number,
        participationId: number,
    ): Promise<ParticipationDTO> {
        return this.prisma.$transaction((tx) =>
            this.updateParticipation(
                tx,
                currentUserId,
                participationId,
                'ACCEPT',
            ),
        );
    }

    async rejectParticipation(
        currentUserId: number,
        participationId: number,
    ): Promise<ParticipationDTO> {
        return this.prisma.$transaction((tx) =>
            this.updateParticipation(
                tx,
                currentUserId,
                participationId,
                'REJECT',
            ),
        );
    }

    async cancelParticipation(
        currentUserId: number,
        participationId: number,
    ): Promise<ParticipationDTO> {
        return this.prisma.$transaction((tx) =>
            this.updateParticipation(
                tx,
                currentUserId,
                participationId,
                'CANCEL',
            ),
        );
    }

    async updateParticipation(
        tx: Prisma.TransactionClient,
        currentUserId: number,
        participationId: number,
        action: 'ACCEPT' | 'REJECT' | 'CANCEL',
    ) {
        const participation = await this.findWithContextOrThrow(
            tx,
            participationId,
        );

        const config = PARTICIPATION_ACTION_CONFIG[action];
        // Policy
        config.applyPolicy(
            this.participationPolicy,
            currentUserId,
            participation,
        );

        // Data
        const data: UpdateParticipationDto = {
            status: config.status,
            cancelled_at: config.cancelled_at(),
            decision_at: config.decision_at(),
        };

        // Update
        const updated = await tx.participation.update({
            where: { id: participationId },
            data,
        });

        // Sync
        await this.slotPolicy.syncSlotStatus(tx, updated.slot_id);

        return updated;
    }

    async findWithContextOrThrow(
        tx: Prisma.TransactionClient,
        participationId: number,
    ): Promise<ParticipationWithStatusAndOrganizer> {
        const participation = await tx.participation.findUnique({
            where: { id: participationId },
            select: {
                user_id: true,
                status: true,
                Slot: {
                    select: {
                        Mission: {
                            select: {
                                Event: {
                                    select: {
                                        user_id: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!participation)
            throw new NotFoundException('Participation not found');
        return {
            userId: participation.user_id,
            status: participation.status,
            event: {
                organizerId: participation.Slot.Mission.Event.user_id,
            },
        };
    }
}
