import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';
import { MsAuthController } from './ms-auth/MsAuth.controller';
import { NatsModule } from 'src/nats/nats.module';

@Module({
    controllers: [MsAuthController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
    imports: [
        NatsModule,
        forwardRef(() => UserModule),
        JwtModule.register({
            global: true,
        }),
    ],
    exports: [],
})
export class AuthModule {}
