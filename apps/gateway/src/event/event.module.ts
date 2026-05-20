import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { UserModule } from 'src/user/user.module';
import { GeoapifyModule } from 'src/geoapify/geoapify.module';

@Module({
    imports: [UserModule, GeoapifyModule],
    controllers: [EventController],
    providers: [EventService],
    exports: [EventService],
})
export class EventModule {}
