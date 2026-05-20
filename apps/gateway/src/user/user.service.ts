import { mapUser } from 'src/user/mapper/user.mapper';
import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { UserDTO } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User_role } from 'prisma/generated/prisma/enums';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}
    async create(createUser: CreateUserDto): Promise<UserDTO> {
        const { password, ...rest } = createUser;

        const newUser = await this.prisma.user.create({
            data: {
                ...rest,
                password_hash: password,
            },
            select: {
                id: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true,
            },
        });
        return mapUser(newUser);
    }

    async findAll(): Promise<UserDTO[]> {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true,
            },
        });

        return users.map((user) => mapUser(user));
    }

    async findOne(id: number): Promise<UserDTO | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true,
            },
        });

        if (!user) return null;

        return mapUser(user);
    }

    async findOneAuth(email: string): Promise<{
        id: number;
        email: string;
        password_hash: string;
        role: User_role;
    } | null> {
        return await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password_hash: true,
                role: true,
            },
        });
    }

    async countById(id: number): Promise<number> {
        return await this.prisma.user.count({ where: { id } });
    }

    async countByEmail(email: string): Promise<number> {
        return await this.prisma.user.count({
            where: { email },
        });
    }

    async findByEmail(
        email: string,
    ): Promise<Pick<UserDTO, 'email' | 'id'> | null> {
        return await this.prisma.user.findUnique({
            where: { email },
            select: { email: true, id: true },
        });
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDTO> {
        const { password, ...rest } = updateUserDto;

        const updatedData = password
            ? {
                ...rest,
                password_hash: password,
            }
            : { ...rest };

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updatedData,
            select: {
                id: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true,
            },
        });

        return mapUser(updatedUser);
    }

    async remove(id: number) {
        return await this.prisma.user.delete({
            where: { id },
        });
    }

    async validateUser(id: number) {
        //Check if User Exist
        const userExist = await this.countById(id);

        if (!userExist)
            throw new NotFoundException(`User with id : ${id} not found.`);
    }

    async validateEmail(id: number, email: string) {
        //Check if email is already used
        if (email) {
            const emailExist = await this.findByEmail(email);
            if (emailExist && emailExist.id !== id) {
                throw new HttpException(
                    `Email already in DB.`,
                    HttpStatus.CONFLICT,
                );
            }
        }
    }
}
