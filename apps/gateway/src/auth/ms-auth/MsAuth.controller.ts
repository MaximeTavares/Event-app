import { Body, Controller, Post, Res, Req, Get } from '@nestjs/common';
import { NatsService } from 'src/nats/nats.service';
import { SigninDto } from '../dto/signin.dto';
import { Public } from 'src/user/decorators/public.decorator';
import type { Request, Response } from 'express';
import { User } from 'src/user/decorators/user.decorator';
import { type CurrentUserData } from '../type/auth.type';

@Controller('ms/auth')
export class MsAuthController {
    constructor(private readonly natsService: NatsService) {}

    @Get('users')
    async getUsers() {
        return this.natsService.send('users.getAll', {});
    }

    @Get('me')
    me(@User() user: CurrentUserData) {
        console.log('🚀 ~ MsAuthController ~ me ~ user:', user);

        return user;
    }

    @Public()
    @Post('signup')
    async signup(@Body() dto: SigninDto) {
        return this.natsService.send('auth.signup', dto);
    }

    @Public()
    @Post('signin')
    async signin(
        @Body() dto: SigninDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const result = await this.natsService.send('auth.signin', dto);

        response.cookie('refresh_token', result.refreshToken, {
            httpOnly: true,
            secure: false,
            path: 'auth/refresh',
        });

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
        console.log('Route refresh token appelée');

        const cookies: Record<string, string> = request.cookies;
        const refreshToken = cookies['refresh_token'];

        console.log('Appel de Nats');

        const result = await this.natsService.send('auth.refresh', {
            refreshToken,
        });

        console.log('reponse de Nats', result);

        response.cookie('refresh_token', result.refreshToken, {
            httpOnly: true,
            path: '/ms/auth/refresh_token',
        });

        return {
            accessToken: result.accessToken,
        };
    }

    // @Public()
    // @Post('refresh_token')
    // async refresh(
    //     @Req() request: Request,
    //     @Res({ passthrough: true }) response: Response,
    // ) {
    //     console.log('Route refresh token appelée');

    //     //Permet de typer les cookies. Un cookie ayant comme structure : <K , V> de type string.
    //     const cookies: Record<string, string> = request.cookies;
    //     const refreshToken = cookies['refresh_token'];

    //     console.log('Appel de Nats');

    //     const result = await this.natsService.send('auth.refresh', {
    //         userId: user.id,
    //         refreshToken,
    //     });

    //     console.log('reponse de Nats', result);

    //     response.cookie('refresh_token', result.refreshToken, {
    //         httpOnly: true,
    //         path: '/auth/refresh',
    //     });

    //     return {
    //         accessToken: result.accessToken,
    //     };
    // }
}
