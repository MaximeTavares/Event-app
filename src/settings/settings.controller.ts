import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import type { IResponse } from 'src/utils/interface/response.interface';
import { User } from 'src/user/decorators/user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import type { MeSettingsDto } from './dto/me-settings.dto';
import { PatchSettingsDto } from './dto/patch-settings.dto';
import { SettingsService } from './settings.service';

@Controller('me/settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) {}

    @Get()
    async get(@User('id') userId: number): Promise<IResponse<MeSettingsDto>> {
        const data = await this.settingsService.getForUser(userId);
        return {
            data,
            timeStamp: new Date(),
            url: 'me/settings',
        };
    }

    @Patch()
    async patch(
        @User('id') userId: number,
        @Body() body: PatchSettingsDto,
    ): Promise<IResponse<MeSettingsDto>> {
        const data = await this.settingsService.patchForUser(userId, body);
        return {
            data,
            timeStamp: new Date(),
            url: 'me/settings',
        };
    }

    @Post('password')
    async changePassword(
        @User('id') userId: number,
        @Body() body: ChangePasswordDto,
    ): Promise<void> {
        await this.settingsService.changePassword(userId, body);
    }
}
