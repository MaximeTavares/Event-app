import { Body, Controller, Post } from '@nestjs/common';
import { NatsService } from 'src/nats/nats.service';
import { SigninDto } from '../dto/signin.dto';
import { Public } from 'src/user/decorators/public.decorator';

@Controller('ms/auth')
export class MsAuthController {
    constructor(private readonly natsService: NatsService) {}

    @Public()
    @Post('signup')
    signup(@Body() dto: SigninDto) {
        return this.natsService.send('auth.signup', dto);
    }
}
