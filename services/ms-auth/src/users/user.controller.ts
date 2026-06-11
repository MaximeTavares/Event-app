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

    @MessagePattern('users.getAll')
    getUsers() {
        return this.userService.findAll();
    }

    @MessagePattern('users.profiles')
    getProfiles(data: { userIds: string[] }) {
        return this.userService.findManyByIds(data.userIds);
    }

    @MessagePattern(USER_SUBJECTS.GET_USER)
    validateUser(data: { userId: string }) {
        return this.userService.findById(data.userId);
    }

    @MessagePattern(SETTINGS_SUBJECTS.GET_SETTINGS)
    async getSettings(data: { userId: string }) {
        const user = await this.userService.findById(data.userId);

        return UserMapper.toPublic(user);
    }

    @MessagePattern(SETTINGS_SUBJECTS.UPDATE_PROFILE)
    async updateProfile(@Payload() data: { userId: string; body: ProfileDto }) {
        const result = await this.userService.updateProfile(
            data.userId,
            UserMapper.toProfileDomain(data.body),
        );

        return result ?? { ok: true };
    }

    @MessagePattern(SETTINGS_SUBJECTS.UPDATE_AVAILABILITY)
    async updateAvailability(
        @Payload() data: { userId: string; body: AvailabilityDto },
    ) {
        const result = await this.userService.updateAvailability(
            data.userId,
            data.body,
        );

        return result ?? { ok: true };
    }

    @MessagePattern(SETTINGS_SUBJECTS.UPDATE_PREFERENCES)
    async updatePreferences(
        @Payload() data: { userId: string; body: PreferencesDto },
    ) {
        const result = await this.userService.updatePreferences(
            data.userId,
            data.body,
        );

        return result ?? { ok: true };
    }

    @MessagePattern(SETTINGS_SUBJECTS.UPDATE_NOTIFICATIONS)
    async updateNotifications(
        @Payload() data: { userId: string; body: NotificationsDto },
    ) {
        const result = await this.userService.updateNotifications(
            data.userId,
            data.body,
        );

        return result ?? { ok: true };
    }

    @MessagePattern(SETTINGS_SUBJECTS.UPDATE_SECURITY)
    async updateSecurity(
        @Payload() data: { userId: string; body: SecurityDto },
    ) {
        const result = await this.userService.updateSecurity(
            data.userId,
            data.body,
        );

        return result ?? { ok: true };
    }
}
