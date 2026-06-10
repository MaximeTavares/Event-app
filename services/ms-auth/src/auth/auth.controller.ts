import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/users/user.service';
import {
    AUTH_SUBJECTS,
    LoginRequestDto,
    LoginResponseDto,
    SETTINGS_SUBJECTS,
    SignupRequestDto,
} from '@app/contracts';

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @MessagePattern(AUTH_SUBJECTS.SIGNUP)
    signup(data: SignupRequestDto) {
        return this.authService.signup(data);
    }

    @MessagePattern(AUTH_SUBJECTS.SIGNIN)
    signin(data: LoginRequestDto) {
        return this.authService.signin(data);
    }

    @MessagePattern(AUTH_SUBJECTS.AUTH_GOOGLE)
    googleSignin(@Payload() data: { idToken: string }) {
        return this.authService.googleSignin(data.idToken);
    }

    @MessagePattern(AUTH_SUBJECTS.SIGNOUT)
    async logout(data: { userId: string }) {
        await this.authService.signout(data.userId);
        return {
            success: true,
        };
    }

    @MessagePattern(AUTH_SUBJECTS.REFRESH_TOKEN)
    refresh(data: { refreshToken: string }): Promise<LoginResponseDto> {
        return this.authService.refresh(data.refreshToken);
    }

    @MessagePattern(SETTINGS_SUBJECTS.CHANGE_PASSWORD)
    changePassword(data: {
        userId: string;
        currendPassword: string;
        newPassword: string;
    }) {
        return this.authService.changePassword(
            data.userId,
            data.currendPassword,
            data.newPassword,
        );
    }
}
