import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { AuthUser } from '../type/auth.type';
import { Request } from 'express';
/**
 * La où le `AuthGard` vérifie l'authentification, le `OwnershipGard` vérifie que l'utilisateur connecté
 * est bien le propriétaire de la route.
 * Renvoi une ForbiddenException si l'utilisateur est incorrect.
 *
 * @throws ForbiddenException
 *
 * @example
 * //GET users/:id
 * \@Get(':id')
 * \@UseGuards(OwnershipGuard)
 *	findOne(
 *	 \@Param('id', ParseIntPipe) id: number,
 *) {}
 */
@Injectable()
export class OwnershipGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context
            .switchToHttp()
            .getRequest<Request & { user: AuthUser }>();

        const paramId = Number(request.params.id);

        if (request.user.id !== paramId)
            throw new ForbiddenException('Access Denied');

        return true;
    }
}
