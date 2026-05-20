import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import type { Response } from 'express';
import { Algorithm } from 'jsonwebtoken';
import { StringValue } from 'ms';
import { PrismaService } from 'prisma/prisma.service';
import { JwtPayload } from './type/auth.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
    ) {}

    async hash(password: string): Promise<string> {
        const hashedPwd = await argon2.hash(password);
        return hashedPwd;
    }

    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return await argon2.verify(hashedPassword, password);
    }

    async createTokens(
        id: number,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        //Préparation du payload
        const payload: JwtPayload = { sub: id };

        //Génération de l'accessToken
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.ACCESSSECRET as string,
            expiresIn: (process.env.ACCESEXPIRE as StringValue) ?? '5m',
            algorithm: (process.env.JWTALGORITHM as Algorithm) ?? 'HS512',
        });

        //Génération du refreshToken
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.REFRESHSECRET as string,
            expiresIn: (process.env.REFRESHEXPIRE as StringValue) ?? '7d',
            algorithm: (process.env.JWTALGORITHM as Algorithm) ?? 'HS512',
        });

        await this.prisma.token.create({
            data: {
                user_id: id,
                token: refreshToken,
            },
        });

        return { accessToken, refreshToken };
    }

    async deleteRefreshToken(token: string, type: 'REFRESH'): Promise<void> {
        await this.prisma.token.deleteMany({
            where: {
                token,
            },
        });
    }

    async verifyToken(token: string) {
        const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
            secret: process.env.REFRESHSECRET,
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
            path: '/auth/refresh_token',
            //signed: true,
            // domain: "shop.mon_nom_de_domaine.fr"
        });
    }
}
