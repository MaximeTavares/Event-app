import { Module } from '@nestjs/common';
import { UserProfileModule } from 'src/user-profile/user-profile.module';
import { UserModule } from 'src/user/user.module';
import { SettingsController } from './settings.controller';
import { AuthModule } from 'src/ms-auth/auth.module';
import { NatsModule } from 'src/nats/nats.module';

@Module({
    imports: [UserModule, UserProfileModule, AuthModule, NatsModule],
    controllers: [SettingsController],
    providers: [],
})
export class SettingsModule {}
