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
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventFiltersDto } from './dto/event-filters.dto';
import { PublicUser, User } from '../ms-auth/decorators/user.decorator';
import { Public } from '../ms-auth/decorators/public.decorator';
import { EventDto, EventWithAddress, PaginatedEventsDto } from '@app/contracts';

@Controller('events')
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Post()
    async create(
        @Body() createEventDTO: CreateEventDto,
        @User('id') userId: string,
    ): Promise<EventWithAddress> {
        return await this.eventService.create(createEventDTO, userId);
    }

    @Public()
    @Get()
    async findAll(
        @Query() filters?: EventFiltersDto,
    ): Promise<PaginatedEventsDto> {
        return await this.eventService.findAll(filters);
    }

    @Get('my-events')
    async findMyAll(@User('id') userId: string): Promise<EventWithAddress[]> {
        return await this.eventService.findAllMyEvents(userId);
    }

    @Public()
    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) eventId: number,
        @PublicUser('id') userId?: string,
        @Query('details') details?: boolean,
    ): Promise<EventWithAddress | EventDto> {
        if (details)
            return this.eventService.findOneWithRelation(eventId, userId);

        return this.eventService.findOne(eventId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateEventDto: UpdateEventDto,
        @User('id') userId: string,
    ) {
        return this.eventService.update(+id, updateEventDto, userId);
    }

    @Patch(':id/cancel')
    cancel(@Param('id') id: string, @User('id') userId: string) {
        return this.eventService.cancel(+id, userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @User('id') userId: string) {
        return this.eventService.remove(+id, userId);
    }
}
