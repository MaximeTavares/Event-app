import { Body, Controller, Post, Res, Req, Get } from '@nestjs/common';
import type { Request, Response } from 'express';
import { SigninResponse, type CurrentUserData } from './type/auth.type';
import { AuthService } from './auth.service';
import { type SigninDto, SignupDto } from './dto/auth.dto';
import { User } from '../user/decorators/user.decorator';
import { NatsService } from '../nats/nats.service';
import { Public } from '../user/decorators/public.decorator';

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
    async signup(@Body() dto: SignupDto) {
        return this.natsService.send('auth.signup', dto);
    }

    @Public()
    @Post('google')
    async googleSignin(
        @Body() body: { idToken: string },
        @Res({ passthrough: true }) response: Response,
    ) {
        const result = await this.natsService.send<
            SigninResponse,
            { idToken: string }
        >('auth.google', body);
        console.log('🚀 ~ AuthController ~ googleSignin ~ result:', result);

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
        @Body() dto: SigninDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const result = await this.natsService.send<SigninResponse, SigninDto>(
            'auth.signin',
            dto,
        );

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
    ) {
        const cookies: Record<string, string> = request.cookies;
        const refreshToken = cookies['refresh_token'];

        const result = await this.natsService.send<
            SigninResponse,
            { refreshToken: string }
        >('auth.refresh', {
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
        const result = await this.natsService.send('auth.signout', {
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
