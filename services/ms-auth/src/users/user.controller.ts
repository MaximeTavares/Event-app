import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import {
    AvailabilityDto,
    NotificationsDto,
    PreferencesDto,
    ProfileDto,
    SecurityDto,
    SETTINGS_SUBJECTS,
    USER_SUBJECTS,
} from '@app/contracts';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserMapper } from './mapper/user.mapper';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    // USERS
    @MessagePattern('users.getAll')
    getUsers() {
        return this.userService.findAll();
    }

    @MessagePattern(USER_SUBJECTS.GET_USER)
    validateUser(data: { userId: string }) {
        return this.userService.findById(data.userId);
    }

    // PROFILE
    @MessagePattern(USER_SUBJECTS.GET_PROFILE)
    async getProfile(data: { userId: string }): Promise<ProfileDto> {
        return this.userService.findProfileById(data.userId);
    }

    @MessagePattern(USER_SUBJECTS.GET_PROFILES)
    getProfiles(data: { userIds: string[] }) {
        return this.userService.findManyByIds(data.userIds);
    }

    @MessagePattern(SETTINGS_SUBJECTS.UPDATE_PROFILE)
    async updateProfile(
        @Payload() data: { userId: string; body: ProfileDto },
    ): Promise<ProfileDto> {
        return this.userService.updateProfile(
            data.userId,
            UserMapper.toProfileDomain(data.body),
        );
    }

    // AVAILABILITY
    @MessagePattern(SETTINGS_SUBJECTS.GET_AVAILABILITY)
    async getAvailability(data: { userId: string }): Promise<AvailabilityDto> {
        return this.userService.findSettingsSection(
            data.userId,
            'availability',
        );
    }

    @MessagePattern(SETTINGS_SUBJECTS.UPDATE_AVAILABILITY)
    async updateAvailability(
        @Payload() data: { userId: string; body: AvailabilityDto },
    ): Promise<AvailabilityDto> {
        return await this.userService.updateSettingsSection(
            data.userId,
            'availability',
            data.body,
        );
    }

    // PREFERENCES
    @MessagePattern(SETTINGS_SUBJECTS.GET_PREFERENCES)
    async getPreferences(data: { userId: string }): Promise<PreferencesDto> {
        return this.userService.findSettingsSection(data.userId, 'preferences');
    }

    @MessagePattern(SETTINGS_SUBJECTS.UPDATE_PREFERENCES)
    async updatePreferences(
        @Payload() data: { userId: string; body: PreferencesDto },
    ): Promise<PreferencesDto> {
        return this.userService.updateSettingsSection(
            data.userId,
            'preferences',
            data.body,
        );
    }

    // NOTIFICATIONS
    @MessagePattern(SETTINGS_SUBJECTS.GET_NOTIFICATIONS)
    async getNotifications(data: {
        userId: string;
    }): Promise<NotificationsDto> {
        return this.userService.findSettingsSection(
            data.userId,
            'notifications',
        );
    }

    @MessagePattern(SETTINGS_SUBJECTS.UPDATE_NOTIFICATIONS)
    async updateNotifications(
        @Payload() data: { userId: string; body: NotificationsDto },
    ): Promise<NotificationsDto> {
        return this.userService.updateSettingsSection(
            data.userId,
            'notifications',
            data.body,
        );
    }

    // SECURITY
    @MessagePattern(SETTINGS_SUBJECTS.GET_SECURITY)
    async getSecurity(data: { userId: string }): Promise<SecurityDto> {
        return this.userService.findSettingsSection(data.userId, 'security');
    }

    @MessagePattern(SETTINGS_SUBJECTS.UPDATE_SECURITY)
    async updateSecurity(
        @Payload() data: { userId: string; body: SecurityDto },
    ): Promise<SecurityDto> {
        return this.userService.updateSettingsSection(
            data.userId,
            'security',
            data.body,
        );
    }
}
