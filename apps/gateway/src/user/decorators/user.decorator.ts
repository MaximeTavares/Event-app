import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from 'src/ms-auth/type/auth.type';

type AuthenticatedRequest = Request & {
    user: AuthUser;
};

export const User = createParamDecorator(
    (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

        const user = request.user;

        return data ? user[data] : user;
    },
);
