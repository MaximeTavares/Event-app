import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { SlotService } from './slot.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { User } from 'src/user/decorators/user.decorator';

@Controller()
export class SlotController {
    constructor(private readonly slotService: SlotService) {}

    @Post('missions/:id/slots')
    async create(
        @User('id') userId: number,
        @Param('id', ParseIntPipe) missionId: number,
        @Body() createSlotDto: CreateSlotDto,
    ) {
        return await this.slotService.create(userId, missionId, createSlotDto);
    }

    @Get('slots/:id')
    findOneById(
        @Param('id', ParseIntPipe) id: number,
        @Query('details') details: boolean,
    ) {
        if (details) return this.slotService.findOneWithParticipants(id);
        return this.slotService.findOneById(id);
    }

    @Patch('slots/:id')
    update(
        @User('id') userId: number,
        @Param('id', ParseIntPipe) slotId: number,
        @Body() updateSlotDto: UpdateSlotDto,
    ) {
        return this.slotService.update(userId, slotId, updateSlotDto);
    }

    @Delete('slots/:id')
    remove(
        @User('id') userId: number,
        @Param('id', ParseIntPipe) slotId: number,
    ) {
        return this.slotService.remove(userId, slotId);
    }
}
