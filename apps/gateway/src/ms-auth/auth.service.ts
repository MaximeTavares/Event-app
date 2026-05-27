import { Injectable } from '@nestjs/common';
import type { Response } from 'express';

@Injectable()
export class AuthService {
    insertIntoCookies(
        cookieName: string,
        token: string,
        response: Response,
        options?: { maxAge: number },
    ) {
        response.cookie(cookieName, token, {
            ...options,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
        });
    }
}
