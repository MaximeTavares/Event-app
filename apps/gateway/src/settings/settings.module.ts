import { Module } from '@nestjs/common';
import { UserProfileModule } from 'src/user-profile/user-profile.module';
import { UserModule } from 'src/user/user.module';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { AuthModule } from 'src/ms-auth/auth.module';

@Module({
    imports: [UserModule, UserProfileModule, AuthModule],
    controllers: [SettingsController],
    providers: [SettingsService],
})
export class SettingsModule {}
