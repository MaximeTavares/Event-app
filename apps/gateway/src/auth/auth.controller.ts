import {
    Body,
    ConflictException,
    Controller,
    Get,
    NotFoundException,
    Post,
    Req,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import type { IResponse } from 'src/utils/interface/response.interface';
import { UserDTO } from 'src/user/dto/user.dto';
import { SigninDto } from './dto/signin.dto';
import type { Request, Response } from 'express';
import { Public } from 'src/user/decorators/public.decorator';
import type {
    JwtPayload,
    SessionResponse,
} from './type/auth.type';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Public()
    @Post('signup')
    async signup(
        @Body() signupData: CreateUserDto,
    ): Promise<IResponse<UserDTO>> {
        // On utilises ce système que si on a pas mis en place le système de filtres
        if (await this.userService.countByEmail(signupData.email))
            throw new ConflictException('Email déjà utilisé');

        // On hash le mot de passe
        signupData.password = await this.authService.hash(signupData.password);

        // créer le user dans la DB
        const newUser: UserDTO = await this.userService.create(signupData);

        return {
            data: newUser,
            timeStamp: new Date(),
            url: 'auth/signup',
        };
    }
    
    @Post('signout')
    async signout(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ): Promise<void> {
        const cookies: Record<string, string> = request.cookies;
        const refreshToken = cookies['refresh_token'];

        if (refreshToken) await this.authService.deleteRefreshToken(refreshToken, 'REFRESH');

        response.clearCookie('refresh_token', {
            secure: false, // TODO : a changer en prod
            httpOnly: true,
            sameSite: 'strict',
            path: '/auth/refresh_token',
        });
    }

    @Public()
    @Post('signin')
    async signin(
        @Body() signinData: SigninDto,
        @Res({ passthrough: true }) response: Response,
    ): Promise<IResponse<SessionResponse>> {
        // Récupérer les infos de l'utilisateur et vérifier s'il existe
        const userData = await this.userService.findOneAuth(signinData.email);
        if (!userData)
            throw new NotFoundException('Email ou mot de passe incorrect');

        //On compare les mdp
        if (
            !(await this.authService.compare(
                signinData.password,
                userData.password_hash,
            ))
        )
            throw new NotFoundException('Email ou mot de passe incorrect');

        // Créer les tokens

        const { accessToken, refreshToken } =
            await this.authService.createTokens(userData.id);
        this.authService.insertIntoCookies(
            refreshToken,
            'refresh_token',
            response,
        );

        const user: Pick<UserDTO, 'role'> = {
            role: userData.role,
        };

        return {
            data: { accessToken, user },
            timeStamp: new Date(),
            url: 'auth/signin',
        };
    }

    /**
     * Route qui permet générer de nouveaux access et refresh Token si le refreshToken
     * dans les cookies n'est pas expiré.
     *
     * Vérifie le refreshToken, si valide génère deux nouveaux tokens et insère le nouveau
     * refreshToken dans les cookies.
     *
     * @returns Un nouveau Access et Refresh Token
     */
    @Public()
    @Get('refresh_token')
    async refresh_token(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ): Promise<IResponse<SessionResponse>> {
        //Permet de typer les cookies. Un cookie ayant comme structure : <K , V> de type string.
        const cookies: Record<string, string> = request.cookies;
        const token = cookies['refresh_token'];
        
        let payload: JwtPayload;
        try {
            payload = await this.authService.verifyToken(token);
        } catch {
            throw new UnauthorizedException();
        }
        const { accessToken, refreshToken } =
        await this.authService.createTokens(payload.sub);
        
        this.authService.insertIntoCookies(
            refreshToken,
            'refresh_token',
            response,
        );

        const userData = await this.userService.findOne(payload.sub);
        if (!userData) throw new NotFoundException('Error');
        const user: Pick<UserDTO, 'role' | 'id'> = {
            id: userData.id,
            role: userData?.role,
        };

        return {
            data: { accessToken, user },
            timeStamp: new Date(),
            url: 'auth/refresh_token',
        };
    }
}
