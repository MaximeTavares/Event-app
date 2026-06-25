import { Body, Controller, Post, Res, Req, Get } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { User } from './decorators/user.decorator';
import { NatsService } from '../nats/nats.service';
import { Public } from './decorators/public.decorator';
import {
    AUTH_SUBJECTS,
    CurrentUserData,
    LoginRequestDto,
    LoginRequestSchema,
    LoginResponseDto,
    SignupRequestDto,
    SignupRequestSchema,
} from '@app/contracts';
import { ZodValidationPipe } from '../utils/zod-validation.pipe';

@Controller('ms/auth')
export class AuthController {
    constructor(
        private readonly natsService: NatsService,
        private readonly authService: AuthService,
    ) {}

    @Get('users')
    async getUsers() {
        return this.natsService.send('users.getAll', {});
    }

    @Get('me')
    me(@User() user: CurrentUserData) {
        return user;
    }

    @Public()
    @Post('signup')
    async signup(
        @Body(ZodValidationPipe(SignupRequestSchema)) dto: SignupRequestDto,
    ) {
        return this.natsService.send(AUTH_SUBJECTS.SIGNUP, dto);
    }

    @Public()
    @Post('google')
    async googleSignin(
        @Body() body: { code: string },
        @Res({ passthrough: true }) response: Response,
    ): Promise<Omit<LoginResponseDto, 'refreshToken'>> {
        const result = await this.natsService.send<
            LoginResponseDto,
            { code: string }
        >(AUTH_SUBJECTS.AUTH_GOOGLE, body);

        this.authService.insertIntoCookies(
            'refresh_token',
            result.refreshToken,
            response,
        );

        return {
            accessToken: result.accessToken,
        };
    }

    @Public()
    @Post('signin')
    async signin(
        @Body(ZodValidationPipe(LoginRequestSchema)) dto: LoginRequestDto,
        @Res({ passthrough: true }) response: Response,
    ): Promise<Omit<LoginResponseDto, 'refreshToken'>> {
        const result = await this.natsService.send<
            LoginResponseDto,
            LoginRequestDto
        >(AUTH_SUBJECTS.SIGNIN, dto);

        this.authService.insertIntoCookies(
            'refresh_token',
            result.refreshToken,
            response,
        );

        return {
            accessToken: result.accessToken,
        };
    }

    @Public()
    @Post('refresh_token')
    async refresh(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ): Promise<{ accessToken: string }> {
        const cookies: Record<string, string> = request.cookies;
        const refreshToken = cookies.refresh_token;

        const result = await this.natsService.send<
            LoginResponseDto,
            { refreshToken: string }
        >(AUTH_SUBJECTS.REFRESH_TOKEN, {
            refreshToken,
        });

        this.authService.insertIntoCookies(
            'refresh_token',
            result.refreshToken,
            response,
        );

        return {
            accessToken: result.accessToken,
        };
    }

    @Post('signout')
    async signout(
        @User() user: CurrentUserData,
        @Res({ passthrough: true }) response: Response,
    ) {
        const result = await this.natsService.send(AUTH_SUBJECTS.SIGNOUT, {
            userId: user.id,
        });

        response.clearCookie('refresh_token', {
            httpOnly: true,
            sameSite: 'strict',
            secure: false,
            path: '/',
        });

        return result;
    }
}
