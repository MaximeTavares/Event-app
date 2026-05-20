import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { EventModule } from 'src/event/event.module';

@Module({
    controllers: [MissionController],
    providers: [MissionService],
    imports: [EventModule],
})
export class MissionModule {}
