import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { Public } from './ms-auth/decorators/public.decorator';
import { NatsService } from './nats/nats.service';

@Controller('health')
export class HealthController {
    constructor(private readonly natsService: NatsService) {}

    @Public()
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
