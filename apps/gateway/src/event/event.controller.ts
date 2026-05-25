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
import {
    EventDetailsDTO,
    EventWithUserAndAddressDTO,
    PaginatedEventsDTO,
} from './dto/event.dto';
import { EventFiltersDto } from './dto/event-filters.dto';
import { User } from '../user/decorators/user.decorator';
import { Public } from '../user/decorators/public.decorator';

@Controller('events')
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Post()
    async create(
        @Body() createEventDTO: CreateEventDto,
        @User('id') userId: number,
    ): Promise<EventWithUserAndAddressDTO> {
        return await this.eventService.create(createEventDTO, userId);
    }

    @Public()
    @Get()
    async findAll(
        @Query() filters?: EventFiltersDto,
    ): Promise<PaginatedEventsDTO> {
        return await this.eventService.findAll(filters);
    }

    @Get('my-events')
    async findMyAll(
        @User('id') userId: number,
    ): Promise<EventWithUserAndAddressDTO[]> {
        return await this.eventService.findAllMyEvents(userId);
    }

    @Public()
    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @Query('details') details?: boolean,
    ): Promise<EventWithUserAndAddressDTO | EventDetailsDTO> {
        if (details) return this.eventService.findOneWithRelation(id);

        return this.eventService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateEventDto: UpdateEventDto,
        @User('id') userId: number,
    ) {
        return this.eventService.update(+id, updateEventDto, userId);
    }

    @Patch(':id/cancel')
    cancel(@Param('id') id: string, @User('id') userId: number) {
        return this.eventService.cancel(+id, userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @User('id') userId: number) {
        return this.eventService.remove(+id, userId);
    }
}
