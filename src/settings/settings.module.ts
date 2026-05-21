import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserProfileModule } from 'src/user-profile/user-profile.module';
import { UserModule } from 'src/user/user.module';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
    imports: [UserModule, UserProfileModule, AuthModule],
    controllers: [SettingsController],
    providers: [SettingsService],
})
export class SettingsModule {}
