import { IsEmail, IsStrongPassword } from 'class-validator';

export class SignupDto {
    @IsEmail()
    email: string;
    @IsStrongPassword()
    password: string;
}

export type SigninDto = {
    email: string;
    password: string;
};
