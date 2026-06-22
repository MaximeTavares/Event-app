import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { GeoapifyModule } from '../geoapify/geoapify.module';
import { NatsModule } from '../nats/nats.module';

@Module({
    imports: [GeoapifyModule, NatsModule],
    controllers: [EventController],
    providers: [EventService],
    exports: [EventService],
})
export class EventModule {}
