import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    NotFoundException,
    ForbiddenException,
    Query,
} from '@nestjs/common';
import { MissionService } from './mission.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { User } from 'src/user/decorators/user.decorator';
import { EventService } from 'src/event/event.service';
import { MissionDTO, MissionWithSlotDTO } from './dto/mission.dto';

@Controller()
export class MissionController {
    constructor(
        private readonly missionService: MissionService,
        private readonly eventService: EventService,
    ) {}

    @Post('events/:event_id/missions')
    async create(
        @User('id') userId: number,
        @Param('event_id', ParseIntPipe) eventId: number,
        @Body() createMissionDto: CreateMissionDto,
    ): Promise<MissionDTO> {
        const event = await this.eventService.findOne(eventId);

        if (!event) throw new NotFoundException('Event not found');

        if (event.data.user.id !== userId)
            throw new ForbiddenException("You're not allowed");

        return this.missionService.create(eventId, createMissionDto);
    }

    @Get('missions')
    findAll() {
        return this.missionService.findAll();
    }

    @Get('missions/:id')
    async findOneById(
        @Param('id', ParseIntPipe) id: number,
        @Query('details') details?: boolean,
    ): Promise<MissionDTO | MissionWithSlotDTO> {
        if (details) return await this.missionService.findOneWithDetails(id);

        return await this.missionService.findOneById(id);
    }

    @Patch('missions/:id')
    async update(
        @User('id') userId: number,
        @Param('id', ParseIntPipe) missionId: number,
        @Body() updateMissionDto: UpdateMissionDto,
    ) {
        return this.missionService.update(userId, missionId, updateMissionDto);
    }

    @Delete('missions/:id')
    async remove(
        @User('id') userId: number,
        @Param('id', ParseIntPipe) missionId: number,
    ) {
        return this.missionService.remove(userId, missionId);
    }
}
