import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NatsService } from './nats.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'nats',
                transport: Transport.NATS,
                options: {
                    servers: process.env.NATS_URL,
                },
            },
        ]),
    ],
    exports: [NatsService],
    providers: [NatsService],
})
export class NatsModule {}
