import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';
import { AuthController } from './ms-auth/auth.controller';
import { NatsModule } from 'src/nats/nats.module';
import { AuthService } from './auth.service';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
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
    exports: [AuthService],
})
export class AuthModule {}
