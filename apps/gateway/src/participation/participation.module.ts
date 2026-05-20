import { Module } from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { ParticipationController } from './participation.controller';
import { ParticipationPolicyService } from './policy/participationPolicy.service.';
import { SlotPolicyService } from './policy/slotPolicy.service';

@Module({
    controllers: [ParticipationController],
    providers: [
        ParticipationService,
        ParticipationPolicyService,
        SlotPolicyService,
    ],
})
export class ParticipationModule {}
