import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from 'src/ms-auth/type/auth.type';

export const User = createParamDecorator(
    (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        return data ? user[data] : user;
    },
);
