import { Module } from '@nestjs/common';
import { GeoapifyModule } from 'src/geoapify/geoapify.module';
import { UserModule } from 'src/user/user.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
    imports: [UserModule, GeoapifyModule],
    controllers: [EventController],
    providers: [EventService],
    exports: [EventService],
})
export class EventModule {}
