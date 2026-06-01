import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { type SigninDto, type SignupDto } from 'src/dto/auth.dto';
import { UserService } from 'src/users/user.service';

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @MessagePattern('auth.signup')
    signup(data: SignupDto) {
        return this.authService.signup(data);
    }

    @MessagePattern('auth.signin')
    signin(data: SigninDto) {
        return this.authService.signin(data);
    }

    @MessagePattern('auth.google')
    googleSignin(@Payload() data: { idToken: string }) {
        return this.authService.googleSignin(data.idToken);
    }

    @MessagePattern('auth.refresh')
    refresh(data: { refreshToken: string }) {
        return this.authService.refresh(data.refreshToken);
    }

    @MessagePattern('users.getAll')
    getUsers() {
        return this.userService.findAll();
    }

    @MessagePattern('auth.signout')
    async logout(data: { userId: string }) {
        await this.authService.signout(data.userId);
        return {
            success: true,
        };
    }
}
