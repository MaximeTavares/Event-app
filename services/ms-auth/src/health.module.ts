import { Module } from '@nestjs/common';
import { HealthController } from 'src/health.controller';
import { NatsModule } from './nats/nats.module';

@Module({
    imports: [NatsModule],
    controllers: [HealthController],
})
export class HealthModule {}
