import { Controller, Get, Post, Param, ParseIntPipe } from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { User } from '../ms-auth/decorators/user.decorator';

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

    @Post('participations/:id/accept')
    accept(@User('id') userId: string, @Param('id', ParseIntPipe) id: number) {
        return this.participationService.transition(userId, id, 'ACCEPT');
    }

    @Post('participations/:id/reject')
    reject(@User('id') userId: string, @Param('id', ParseIntPipe) id: number) {
        return this.participationService.transition(userId, id, 'REJECT');
    }

    @Post('participations/:id/cancel')
    cancel(@User('id') userId: string, @Param('id', ParseIntPipe) id: number) {
        return this.participationService.transition(userId, id, 'CANCEL');
    }

    // @Patch('participations/:id/status')
    // updateParticipation(
    //     @User('id') userId: string,
    //     @Param('id', ParseIntPipe) participationId: number,
    //     @Body() dto: UpdateParticipationDto,
    // ) {
    //     return this.participationService.updateStatus(
    //         userId,
    //         participationId,
    //         dto.toStatus,
    //     );
    // }
}
