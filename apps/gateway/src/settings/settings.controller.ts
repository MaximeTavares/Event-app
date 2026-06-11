import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { NatsService } from '../nats/nats.service';
import { User } from '../user/decorators/user.decorator';
import {
    AvailabilityDto,
    availabilitySchema,
    ChangePasswordDto,
    NotificationsDto,
    notificationsSchema,
    PreferencesDto,
    preferencesSchema,
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
        @Body(ZodValidationPipe(availabilitySchema)) body: AvailabilityDto,
    ) {
        return this.natsService.send(SETTINGS_SUBJECTS.UPDATE_AVAILABILITY, {
            userId,
            body,
        });
    }

    @Patch('preferences')
    async updatePreferences(
        @User('id') userId: string,
        @Body(ZodValidationPipe(preferencesSchema)) body: PreferencesDto,
    ) {
        return this.natsService.send(SETTINGS_SUBJECTS.UPDATE_PREFERENCES, {
            userId,
            body,
        });
    }

    @Patch('notifications')
    async updateNotifications(
        @User('id') userId: string,
        @Body(ZodValidationPipe(notificationsSchema)) body: NotificationsDto,
    ) {
        return this.natsService.send(SETTINGS_SUBJECTS.UPDATE_NOTIFICATIONS, {
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
