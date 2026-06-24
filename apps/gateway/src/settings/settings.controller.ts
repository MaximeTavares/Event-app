import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { NatsService } from '../nats/nats.service';
import { User } from '../ms-auth/decorators/user.decorator';
import {
    AvailabilityDto,
    availabilitySchema,
    ChangePasswordDto,
    ChangePasswordSchema,
    NotificationsDto,
    notificationsSchema,
    PreferencesDto,
    preferencesSchema,
    ProfileDto,
    profileSchema,
    SecurityDto,
    SecuritySchema,
    SETTINGS_SUBJECTS,
    USER_SUBJECTS,
} from '@app/contracts';
import { ZodValidationPipe } from '../utils/zod-validation.pipe';

@Controller('me')
export class SettingsController {
    constructor(private readonly natsService: NatsService) {}

    //PROFILE
    @Get('profile')
    async getProfile(@User('id') userId: string) {
        return this.natsService.send(USER_SUBJECTS.GET_PROFILE, {
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

    // AVAILABILITY
    @Get('availability')
    async getAvailability(@User('id') userId: string) {
        return this.natsService.send(SETTINGS_SUBJECTS.GET_AVAILABILITY, {
            userId,
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

    // PREFERENCES
    @Get('preferences')
    async getPreferences(@User('id') userId: string) {
        return this.natsService.send(SETTINGS_SUBJECTS.GET_PREFERENCES, {
            userId,
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

    // NOTIFICATIONS
    @Get('notifications')
    async getNotifications(@User('id') userId: string) {
        return this.natsService.send(SETTINGS_SUBJECTS.GET_NOTIFICATIONS, {
            userId,
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

    // SECURITY
    @Get('security')
    async getSecurity(@User('id') userId: string) {
        return this.natsService.send(SETTINGS_SUBJECTS.GET_SECURITY, {
            userId,
        });
    }

    @Patch('security')
    async updateSecurity(
        @User('id') userId: string,
        @Body(ZodValidationPipe(SecuritySchema)) body: SecurityDto,
    ) {
        return this.natsService.send(SETTINGS_SUBJECTS.UPDATE_SECURITY, {
            userId,
            body,
        });
    }

    // PASSWORDCHANGE
    @Post('password')
    async changePassword(
        @User('id') userId: string,
        @Body(ZodValidationPipe(ChangePasswordSchema)) body: ChangePasswordDto,
    ): Promise<void> {
        await this.natsService.send(SETTINGS_SUBJECTS.CHANGE_PASSWORD, {
            userId,
            body,
        });
    }
}
