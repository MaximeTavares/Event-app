import { User_role } from '@prisma/client';
import { IsEmail, IsEnum, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;

    @IsEnum(User_role)
    role: User_role;
}
