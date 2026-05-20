import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { PrismaService } from 'prisma/prisma.service';
import { SlotMapper } from './dto/mapper/slot.mapper';
import { SlotDTO, SlotWithParticipationDto } from './dto/slot.dto';

type OwnerShipEntity = 'Mission' | 'Slot';
@Injectable()
export class SlotService {
    constructor(private readonly prisma: PrismaService) {}
    async create(
        userId: number,
        missionId: number,
        createSlotDto: CreateSlotDto,
    ) {
        await this.checkOwnership('Mission', missionId, userId);

        if (new Date(createSlotDto.start_at) >= new Date(createSlotDto.end_at))
            throw new BadRequestException('Start date must be before end date');

        const slot = await this.prisma.slot.create({
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
    async findOneById(slotId: number): Promise<SlotDTO> {
        const [slot, currentParticipants] = await Promise.all([
            this.prisma.slot.findUnique({ where: { id: slotId } }),
            this.prisma.participation.count({
                where: { slot_id: slotId, status: 'ACCEPTED' },
            }),
        ]);

        if (!slot) throw new NotFoundException('Slot not found');

        return SlotMapper.MapSlot(slot, currentParticipants);
    }

    async findOneWithParticipants(
        slotId: number,
    ): Promise<SlotWithParticipationDto> {
        const [slot, currentParticipants] = await Promise.all([
            this.prisma.slot.findUnique({
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
                        select: { Event: { select: { user_id: true } } },
                    },
                    Participation: {
                        select: {
                            id: true,
                            status: true,
                            User: {
                                select: {
                                    email: true,
                                    id: true,
                                    User_profile: {
                                        select: {
                                            first_name: true,
                                            last_name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.participation.count({
                where: { slot_id: slotId, status: 'ACCEPTED' },
            }),
        ]);

        if (!slot) throw new NotFoundException('Slot not found');

        return SlotMapper.toSlotWithParticipations(slot, currentParticipants);
    }

    async update(
        userId: number,
        slotId: number,
        updateSlotDto: UpdateSlotDto,
    ): Promise<{ message: string }> {
        await this.checkOwnership('Slot', slotId, userId);

        await this.prisma.slot.update({
            where: { id: slotId },
            data: updateSlotDto,
        });

        return { message: 'Slot updated successfully' };
    }

    async remove(userId: number, slotId: number): Promise<{ message: string }> {
        await this.checkOwnership('Slot', slotId, userId);

        await this.prisma.slot.delete({ where: { id: slotId } });

        return { message: 'Slot removed successfully' };
    }

    async checkOwnership<T extends OwnerShipEntity>(
        entityType: T,
        id: number,
        userId: number,
    ) {
        if (entityType === 'Mission') {
            const mission = await this.prisma.mission.findUnique({
                where: { id },
                include: { Event: true },
            });

            if (!mission) throw new NotFoundException('Mission not found');

            if (mission.Event.user_id !== userId)
                throw new ForbiddenException("You're not allowed");

            return mission;
        }

        if (entityType === 'Slot') {
            const slot = await this.prisma.slot.findUnique({
                where: { id },
                include: {
                    Mission: { include: { Event: true } },
                },
            });

            if (!slot) throw new NotFoundException('Slot not found');

            if (slot.Mission.Event.user_id !== userId)
                throw new ForbiddenException("You're not allowed");

            return slot;
        }
    }
}
