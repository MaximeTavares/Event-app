import { JwtTokenService } from './../jwt/jwt.service';
import { Injectable } from '@nestjs/common';
import { SigninDto, SignupDto } from 'src/dto/auth.dto';
import { RpcException } from '@nestjs/microservices';
import { compare, hash } from 'src/utils/password.util';
import { UserService } from 'src/users/user.service';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { GoogleAuthService } from '../../google/google-auth.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly googleAuthService: GoogleAuthService,
        private readonly userService: UserService,
        private readonly jwtTokenService: JwtTokenService,
        private readonly refreshTokenService: RefreshTokenService,
    ) {}

    async signup(data: SignupDto) {
        console.log('Appel du ms signup');
        const existing = await this.userService.findByEmail(data.email);

        if (existing) throw new RpcException('User already exist');

        const hashedPassword = await hash(data.password);

        const user = await this.userService.create({
            ...data,
            password: hashedPassword,
        });

        return {
            id: user._id,
            email: user.email,
        };
    }

    async signin(data: SigninDto) {
        console.log('Appel du ms signin');

        // Récupérer les infos de l'utilisateur et vérifier s'il existe
        const user = await this.userService.findByEmail(data.email);
        if (!user?.password)
            throw new RpcException('Email ou mot de passe incorrect');

        //On compare les mdp
        const isValid = await compare(data.password, user.password);
        if (!isValid) throw new RpcException('Email ou mot de passe incorrect');

        // Créer les tokens
        const accessToken =
            await this.jwtTokenService.generateAccessToken(user);

        const refreshToken =
            await this.jwtTokenService.generateRefreshToken(user);

        await this.refreshTokenService.save(user.id, refreshToken);

        return {
            accessToken,
            refreshToken,
        };
    }

    async googleSignin(idToken: string) {
        // 1. Verify google token
        const payload = await this.googleAuthService.verifyToken(idToken);

        // 2. Find or create user
        const user = await this.userService.findOrCreateGoogleUser({
            email: payload.email!,
            googleSub: payload.sub,
            firstName: payload.given_name,
            lastName: payload.family_name,
            avatarUrl: payload.picture,
        });

        // 3. JWT Token generation
        const accessToken = await this.jwtTokenService.generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        const refreshToken = await this.jwtTokenService.generateRefreshToken({
            id: user.id,
        });

        await this.refreshTokenService.save(user.id, refreshToken);

        // 4. Return information

        return {
            accessToken,
            refreshToken,
            // user: {
            //     id: user.id,
            //     email: user.email,
            //     role: user.role,
            // },
        };
    }

    async refresh(refreshToken: string) {
        // 1. Verify refresh token (JWT)
        let payload: { sub: string };

        try {
            payload = await this.jwtTokenService.verifyToken(refreshToken);
        } catch {
            throw new RpcException('Invalid refresh token');
        }

        const userId = payload.sub;
        const user = await this.userService.findById(userId);

        if (!user) throw new RpcException('User not found');

        // 2. Check token in DB (rotation / revocation)
        const isValid = await this.refreshTokenService.validate(
            userId,
            refreshToken,
        );

        if (!isValid) {
            throw new RpcException('Refresh token revoked');
        }

        // 3. Generate user (optionnel si besoin user data)
        // const user = await this.userService.findById(userId);

        // 4. Generate new tokens
        const accessToken = await this.jwtTokenService.generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        const newRefreshToken = await this.jwtTokenService.generateRefreshToken(
            { id: userId },
        );

        // 5. Rotate token in DB
        await this.refreshTokenService.rotate(
            userId,
            refreshToken,
            newRefreshToken,
        );

        return {
            accessToken,
            refreshToken: newRefreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }

    async signout(userId: string) {
        await this.refreshTokenService.revoke(userId);
    }
}
