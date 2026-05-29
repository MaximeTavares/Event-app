import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { UserProfileModule } from './user-profile/user-profile.module';
import { AddressModule } from './address/address.module';
import { EventModule } from './event/event.module';

import { AuthModule } from './ms-auth/auth.module';
import { SlotModule } from './slot/slot.module';
import { MissionModule } from './mission/mission.module';
import { ParticipationModule } from './participation/participation.module';
import { GeoapifyModule } from './geoapify/geoapify.module';
import { NatsModule } from './nats/nats.module';
import { AuthController } from './ms-auth/auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { HealthController } from './health.controller';
import { HealthModule } from './health.module';

@Module({
    imports: [
        NatsModule,
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        UserModule,
        UserProfileModule,
        AddressModule,
        EventModule,
        MissionModule,
        AuthModule,
        SlotModule,
        ParticipationModule,
        GeoapifyModule,
        HealthModule,
    ],
    controllers: [AppController, AuthController, HealthController],
    providers: [AppService],
})
export class AppModule {}
