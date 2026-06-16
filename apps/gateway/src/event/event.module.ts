import { Module } from '@nestjs/common';
import { GeoapifyModule } from 'src/geoapify/geoapify.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { NatsModule } from 'src/nats/nats.module';

@Module({
    imports: [GeoapifyModule, NatsModule],
    controllers: [EventController],
    providers: [EventService],
    exports: [EventService],
})
export class EventModule {}
