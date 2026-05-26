import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/user/decorators/public.decorator';
import { Algorithm } from 'jsonwebtoken';
import { JwtPayload } from '../type/auth.type';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        //Vérifie si la route est public
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (isPublic) {
            return true;
        }

        //Récupère le request
        const request = context.switchToHttp().getRequest<Request>();

        //Recupère le token du header
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            //Verifie le token et récupère le payload
            const payload = await this.jwtService.verifyAsync<JwtPayload>(
                token,
                {
                    algorithms: [
                        (process.env.JWTALGORITHM as Algorithm) ?? 'HS512',
                    ],
                    secret: process.env.JWT_ACCESS_SECRET,
                },
            );
            // Assignation du payload à la request afin qu'elle soit accessible sur nos routes
            request['user'] = {
                id: payload.sub,
                email: payload.email,
                role: payload.role,
            };
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
