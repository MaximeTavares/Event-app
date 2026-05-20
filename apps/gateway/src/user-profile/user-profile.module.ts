import { forwardRef, Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { UserModule } from 'src/user/user.module';
import { GeoapifyModule } from 'src/geoapify/geoapify.module';

@Module({
    imports: [forwardRef(() => UserModule), GeoapifyModule],
    controllers: [UserProfileController],
    providers: [UserProfileService],
    exports: [UserProfileService],
})
export class UserProfileModule {}
