import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { AuthModule } from 'src/ms-auth/auth.module';
import { NatsModule } from 'src/nats/nats.module';

@Module({
    imports: [AuthModule, NatsModule],
    controllers: [SettingsController],
    providers: [],
})
export class SettingsModule {}
