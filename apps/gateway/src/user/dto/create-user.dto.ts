import { IsEmail, IsEnum, IsStrongPassword } from 'class-validator';
import { User_role } from 'prisma/generated/prisma/enums';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;

    @IsEnum(User_role)
    role: User_role;
}
