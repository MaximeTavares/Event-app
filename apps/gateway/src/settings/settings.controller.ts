import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { NatsService } from '../nats/nats.service';
import { User } from '../user/decorators/user.decorator';
import {
    AvailabilityDto,
    ChangePasswordDto,
    ProfileDto,
    profileSchema,
    SETTINGS_SUBJECTS,
} from '@app/contracts';
import { ZodValidationPipe } from 'src/utils/zod-validation.pipe';

@Controller('me')
export class SettingsController {
    constructor(private readonly natsService: NatsService) {}

    @Get('settings')
    async get(@User('id') userId: string) {
        return this.natsService.send(SETTINGS_SUBJECTS.GET_SETTINGS, {
            userId,
        });
    }

    @Patch('profile')
    async updateProfile(
        @User('id') userId: string,
        @Body(ZodValidationPipe(profileSchema)) body: ProfileDto,
    ) {
        return this.natsService.send(SETTINGS_SUBJECTS.UPDATE_PROFILE, {
            userId,
            body,
        });
    }

    @Patch('availability')
    async updateAvailability(
        @User('id') userId: string,
        @Body() body: AvailabilityDto,
    ) {
        return this.natsService.send(SETTINGS_SUBJECTS.UPDATE_AVAILABILITY, {
            userId,
            body,
        });
    }

    @Post('password')
    async changePassword(
        @User('id') userId: string,
        @Body() body: ChangePasswordDto,
    ): Promise<void> {
        await this.natsService.send(SETTINGS_SUBJECTS.CHANGE_PASSWORD, {
            userId,
            currentPassword: body.currentPassword,
            newPassword: body.newPassword,
        });
    }
}
