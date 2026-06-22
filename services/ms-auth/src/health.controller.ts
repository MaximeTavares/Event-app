import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { NatsService } from './nats/nats.service';

@Controller('health')
export class HealthController {
    constructor(private readonly natsService: NatsService) {}

    @Get()
    async check() {
        try {
            await this.natsService.checkConnection();
            return { status: 'ok', nats: 'connected' };
        } catch {
            throw new ServiceUnavailableException({
                status: 'error',
                nats: 'disconnected',
            });
        }
    }
}
