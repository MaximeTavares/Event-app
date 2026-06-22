import { Module } from '@nestjs/common';
import { SlotService } from './slot.service';
import { SlotController } from './slot.controller';
import { NatsModule } from '../nats/nats.module';

@Module({
    imports: [NatsModule],
    controllers: [SlotController],
    providers: [SlotService],
})
export class SlotModule {}
