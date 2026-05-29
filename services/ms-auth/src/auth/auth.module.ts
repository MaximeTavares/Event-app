import { Module } from '@nestjs/common';
import { NatsModule } from 'src/nats/nats.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/users/user.module';
import { JwtTokenModule } from 'src/jwt/jwt.module';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';
import { GoogleAuthModule } from '../../google/google-auth.module';

@Module({
    imports: [
        NatsModule,
        UserModule,
        JwtTokenModule,
        RefreshTokenModule,
        GoogleAuthModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
