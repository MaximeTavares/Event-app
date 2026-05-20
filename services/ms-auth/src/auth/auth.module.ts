import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthUser, AuthUserSchema } from 'src/authUser.schema';
import { NatsModule } from 'src/nats/nats.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
        NatsModule,
        MongooseModule.forFeature([
            { name: AuthUser.name, schema: AuthUserSchema },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
