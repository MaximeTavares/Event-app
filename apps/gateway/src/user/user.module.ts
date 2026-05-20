import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserProfileModule } from 'src/user-profile/user-profile.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [AuthModule, UserProfileModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
