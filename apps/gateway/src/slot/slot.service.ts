import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { SlotMapper } from './dto/mapper/slot.mapper';
import { prisma } from '@app/db';
import { NatsService } from '../nats/nats.service';
import { ParticipationStatus, SlotDetails, SlotDto } from '@app/contracts';

type OwnerShipEntity = 'Mission' | 'Slot';

export interface ParticipantWithProfile {
    participation_id: number;
    participation_status: ParticipationStatus;
    userId: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
}
export interface UserProfileResponse {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
}

@Injectable()
export class SlotService {
    constructor(private readonly nastService: NatsService) {}
    async create(
        userId: string,
        missionId: number,
        createSlotDto: CreateSlotDto,
    ) {
        await this.checkOwnership('Mission', missionId, userId);

        if (new Date(createSlotDto.start_at) >= new Date(createSlotDto.end_at))
            throw new BadRequestException('Start date must be before end date');

        const slot = await prisma.slot.create({
            data: {
                mission_id: missionId,
                ...createSlotDto,
            },
        });
        return slot;
    }

    /**
     * Récupère un Slot par son ID et calcule le nombre de participants "ACCEPTED".
     *
     * Cette méthode utilise `Promise.all` afin d'exécuter en parallèle :
     * - la récupération du Slot
     * - le comptage des participations "ACCEPTED" associées
     *
     * Les deux requêtes sont indépendantes, donc on peut utiliser Promise.all :
     * - le Slot n'a pas besoin du count pour être récupéré
     * - le count n'a pas besoin du Slot pour être calculé
     *
     * Cela permet de réduire le temps total d'exécution en évitant
     * une exécution séquentielle (slot puis count).
     *
     * Exemple :
     * Sans Promise.all :
     *   slot (5ms) → wait → count (5ms) = 10ms
     *
     * Avec Promise.all :
     *   slot (5ms)
     *   count (5ms)
     *   → exécutés en parallèle = 5ms
     *
     * Attention :
     * Si l'une des promesses échoue, Promise.all échoue entièrement.
     *
     * @param slotId - ID du slot à récupérer
     * @returns SlotDTO enrichi avec currentParticipants (status "ACCEPTED" uniquement)
     * @throws NotFoundException si le slot n'existe pas
     */
    async findOneById(userId: string, slotId: number): Promise<SlotDto> {
        const [slot, currentParticipants] = await Promise.all([
            prisma.slot.findUnique({
                where: { id: slotId },
                select: {
                    id: true,
                    mission_id: true,
                    start_at: true,
                    end_at: true,
                    max_participant: true,
                    status: true,
                    Mission: {
                        select: { Event: { select: { organizer_id: true } } },
                    },
                    Participation: { select: { user_id: true } },
                },
            }),
            prisma.participation.count({
                where: { slot_id: slotId, status: 'ACCEPTED' },
            }),
        ]);

        if (!slot) throw new NotFoundException('Slot not found');

        return SlotMapper.toSlotDto(userId, slot, currentParticipants);
    }

    async findOneWithParticipants(
        userId: string,
        slotId: number,
    ): Promise<SlotDetails> {
        const [slot, currentParticipants] = await Promise.all([
            prisma.slot.findUnique({
                where: {
                    id: slotId,
                },
                select: {
                    id: true,
                    mission_id: true,
                    status: true,
                    start_at: true,
                    end_at: true,
                    max_participant: true,
                    Mission: {
                        select: { Event: { select: { organizer_id: true } } },
                    },
                    Participation: {
                        select: {
                            id: true,
                            status: true,
                            user_id: true,
                        },
                    },
                },
            }),
            prisma.participation.count({
                where: { slot_id: slotId, status: 'ACCEPTED' },
            }),
        ]);

        if (!slot) throw new NotFoundException('Slot not found');

        const userIds = [...new Set(slot.Participation.map((p) => p.user_id))];

        const participantsProfiles = await this.nastService.send<
            UserProfileResponse[],
            { userIds: string[] }
        >('users.profiles', { userIds });

        const profilesMap = new Map(
            participantsProfiles.map((profile) => [profile.id, profile]),
        );

        const participants = slot.Participation.map((participation) => {
            const profile = profilesMap.get(participation.user_id);

            return {
                slot_id: slot.id,
                id: participation.id,
                status: participation.status,
                user_id: participation.user_id,
                email: profile?.email ?? '',
                first_name: profile?.first_name ?? null,
                last_name: profile?.last_name ?? null,
                avatar_url: profile?.avatar_url ?? null,
            };
        });

        return SlotMapper.toSlotWithParticipations(
            userId,
            slot,
            participants,
            currentParticipants,
        );
    }

    async update(
        userId: string,
        slotId: number,
        updateSlotDto: UpdateSlotDto,
    ): Promise<{ message: string }> {
        await this.checkOwnership('Slot', slotId, userId);

        await prisma.slot.update({
            where: { id: slotId },
            data: updateSlotDto,
        });

        return { message: 'Slot updated successfully' };
    }

    async remove(userId: string, slotId: number): Promise<{ message: string }> {
        await this.checkOwnership('Slot', slotId, userId);

        await prisma.slot.delete({ where: { id: slotId } });

        return { message: 'Slot removed successfully' };
    }

    async checkOwnership<T extends OwnerShipEntity>(
        entityType: T,
        id: number,
        userId: string,
    ) {
        if (entityType === 'Mission') {
            const mission = await prisma.mission.findUnique({
                where: { id },
                include: { Event: true },
            });

            if (!mission) throw new NotFoundException('Mission not found');

            if (mission.Event.organizer_id !== userId)
                throw new ForbiddenException("You're not allowed");

            return mission;
        }

        if (entityType === 'Slot') {
            const slot = await prisma.slot.findUnique({
                where: { id },
                include: {
                    Mission: { include: { Event: true } },
                },
            });

            if (!slot) throw new NotFoundException('Slot not found');

            if (slot.Mission.Event.organizer_id !== userId)
                throw new ForbiddenException("You're not allowed");

            return slot;
        }
    }
}
