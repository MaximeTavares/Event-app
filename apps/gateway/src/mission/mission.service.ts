import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { PrismaService } from 'prisma/prisma.service';
import { MissionDTO, MissionWithDetails } from './dto/mission.dto';
import { mapMission, toMissionDetails } from './mapper/mission.mapper';

@Injectable()
export class MissionService {
    private readonly missionSelect = {
        id: true,
        event_id: true,
        title: true,
        description: true,
        status: true,
        created_at: true,
        updated_at: true,
    };

    constructor(private readonly prisma: PrismaService) {}

    async create(
        eventId: number,
        createMissionDto: CreateMissionDto,
    ): Promise<MissionDTO> {
        const newMission = await this.prisma.mission.create({
            data: {
                ...createMissionDto,
                Event: { connect: { id: eventId } },
            },
            select: this.missionSelect,
        });

        return mapMission(newMission);
    }

    async findAll(): Promise<MissionDTO[]> {
        const missions = await this.prisma.mission.findMany({
            select: this.missionSelect,
        });

        return missions.map((mission) => mapMission(mission));
    }

    async findOneById(id: number): Promise<MissionDTO> {
        const mission = await this.prisma.mission.findUnique({
            where: { id },
            select: this.missionSelect,
        });
        if (!mission) throw new NotFoundException('Mission not found');

        return mapMission(mission);
    }

    async findOneWithDetails(id: number): Promise<MissionWithDetails> {
        const mission = await this.prisma.mission.findUnique({
            where: { id },
            select: {
                id: true,
                event_id: true,
                title: true,
                description: true,
                status: true,
                Event: { select: { user_id: true } },
                Slot: {
                    select: {
                        id: true,
                        start_at: true,
                        end_at: true,
                        max_participant: true,
                        status: true,
                        Participation: {
                            select: {
                                id: true,
                                status: true,
                                User: {
                                    select: {
                                        id: true,
                                        email: true,
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
                },
            },
        });

        if (!mission) throw new NotFoundException('Mission not found');

        return toMissionDetails(mission);
    }

    async update(
        userId: number,
        missionId: number,
        updateMissionDto: UpdateMissionDto,
    ): Promise<MissionDTO> {
        await this.verifyOwnership(userId, missionId);

        const updatedMission = await this.prisma.mission.update({
            where: { id: missionId },
            data: updateMissionDto,
            select: this.missionSelect,
        });
        return mapMission(updatedMission);
    }

    async remove(userId: number, missionId: number) {
        await this.verifyOwnership(userId, missionId);

        await this.prisma.mission.delete({
            where: { id: missionId },
        });

        return { message: 'Mission removed successfully' };
    }

    async verifyOwnership(userId: number, missionId: number) {
        const mission = await this.prisma.mission.findUnique({
            where: { id: missionId },
            include: { Event: true },
        });

        if (!mission) throw new NotFoundException('Mission not found');

        if (mission?.Event.user_id !== userId)
            throw new ForbiddenException('Not allowed');

        return mission;
    }
}
