import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserProfileModule } from 'src/user-profile/user-profile.module';
import { AuthModule } from 'src/ms-auth/auth.module';

@Module({
    imports: [AuthModule, UserProfileModule],
    controllers: [],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
