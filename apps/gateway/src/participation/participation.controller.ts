import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    ParseIntPipe,
} from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { User } from 'src/user/decorators/user.decorator';

@Controller()
export class ParticipationController {
    constructor(private readonly participationService: ParticipationService) {}

    @Post('slots/:id/participate')
    create(
        @User('id') userId: string,
        @Param('id', ParseIntPipe) slotId: number,
    ) {
        return this.participationService.create(userId, slotId);
    }

    @Get('participations')
    findAll() {
        return this.participationService.findAll();
    }

    @Get('participations/:id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.participationService.findOne(id);
    }

    @Get('me/participations')
    getMyParticipations(@User('id') userId: string) {
        return this.participationService.getMyParticipations(userId);
    }

    @Get('me/slots')
    getMySlots(@User('id') userId: string) {
        return this.participationService.getMySlots(userId);
    }

    @Get('me/missions')
    getMyMissions(@User('id') userId: string) {
        return this.participationService.getMyMissions(userId);
    }

    @Get('me/events')
    getMyEvents(@User('id') userId: string) {
        return this.participationService.getMyEvents(userId);
    }

    @Patch('participations/:id/accept')
    acceptParticipation(
        @User('id') userId: string,
        @Param('id', ParseIntPipe) participationId: number,
    ) {
        return this.participationService.acceptParticipation(
            userId,
            participationId,
        );
    }

    @Patch('participations/:id/reject')
    rejectParticipation(
        @User('id') userId: string,
        @Param('id', ParseIntPipe) participationId: number,
    ) {
        return this.participationService.rejectParticipation(
            userId,
            participationId,
        );
    }

    @Patch('participations/:id/cancel')
    cancelParticipation(
        @User('id') userId: string,
        @Param('id', ParseIntPipe) participationId: number,
    ) {
        return this.participationService.cancelParticipation(
            userId,
            participationId,
        );
    }
}
