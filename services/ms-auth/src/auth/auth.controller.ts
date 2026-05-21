import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { type SignupDto } from 'src/dto/auth.dto';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern('auth.signup')
    signup(data: SignupDto) {
        console.log('Creation de User');
        return this.authService.signup(data);
    }
}
