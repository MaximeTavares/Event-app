import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, Role } from 'src/type/auth.type';
import { Algorithm } from 'jsonwebtoken';
import { StringValue } from 'ms';
import type { Response } from 'express';

@Injectable()
export class JwtTokenService {
    constructor(private readonly jwtService: JwtService) {}

    async generateAccessToken(user: { id: string; email: string; role: Role }) {
        //Préparation du payload
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        //Génération de l'accessToken

        return this.jwtService.signAsync(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: (process.env.ACCESEXPIRE as StringValue) ?? '5m',
            algorithm: (process.env.JWTALGORITHM as Algorithm) ?? 'HS512',
        });
    }

    async generateRefreshToken(user: { id: string }) {
        //Préparation du payload
        const payload = {
            sub: user.id,
        };

        //Génération du refreshToken
        return this.jwtService.signAsync(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: (process.env.REFRESHEXPIRE as StringValue) ?? '7d',
            algorithm: (process.env.JWTALGORITHM as Algorithm) ?? 'HS512',
        });
    }

    async deleteRefreshToken(token: string): Promise<void> {
        //TODO Gérer mongo db
        // await this.prisma.token.deleteMany({
        //     where: {
        //         token,
        //     },
        // });
    }

    async verifyToken(token: string) {
        const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_REFRESH_SECRET,
        });

        return payload;
    }

    insertIntoCookies(
        token: string,
        cookieName: string,
        response: Response,
        option?: { maxAge: number },
    ) {
        response.cookie(cookieName, token, {
            ...option,
            secure: false, //TODO : a changer en prod
            httpOnly: true,
            sameSite: 'strict',
            path: '/ms/auth/refresh_token',
            //signed: true,
            // domain: "shop.mon_nom_de_domaine.fr"
        });
    }
}
