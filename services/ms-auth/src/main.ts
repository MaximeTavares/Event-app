import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { HealthAppModule } from './health-app.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.NATS,
            options: {
                servers: [`${process.env.NATS_URL}`],
            },
        },
    );

    await app.listen();

    // Serveur HTTP minimal, dédié uniquement au healthcheck Docker
    const healthApp = await NestFactory.create(HealthAppModule);
    const healthPort = process.env.HEALTH_PORT ?? 3000;
    await healthApp.listen(healthPort);
}
void bootstrap();
