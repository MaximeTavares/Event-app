import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthUser } from 'src/authUser.schema';
import { SignupDto } from 'src/dto/auth.dto';
import { NatsService } from 'src/nats/nats.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(AuthUser.name) private readonly userModel: Model<AuthUser>,
        private readonly natsService: NatsService,
    ) {}

    async signup(data: SignupDto) {
        const existing = await this.userModel.findOne({ email: data.email });

        if (existing) throw new Error('User already exist');

        const hashedPassword = await argon2.hash(data.password);

        const user = await this.userModel.create({
            email: data.email,
            password: hashedPassword,
        });

        this.natsService.emit('user.created', {
            userId: user._id.toString(),
            email: user.email,
        });

        return {
            id: user._id,
            email: user.email,
        };
    }
}
