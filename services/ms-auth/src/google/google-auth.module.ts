import { Module } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';

@Module({
    imports: [],
    providers: [GoogleAuthService],
    exports: [GoogleAuthService],
})
export class GoogleAuthModule {}
