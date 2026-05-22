import {
    Controller,
    Get,
    Body,
    Patch,
    Param,
    Delete,
    NotFoundException,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDTO } from './dto/user.dto';
// import { AuthService } from 'src/auth/auth.service';
import { UserProfileService } from 'src/user-profile/user-profile.service';
import { UserWithProfileAndAddressDTO } from 'src/user-profile/dto/user-profile.dto';
import { OwnershipGuard } from 'src/ms-auth/guard/ownership.guard';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        // private readonly authService: AuthService,
        private readonly userProfileService: UserProfileService,
    ) {}

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    @UseGuards(OwnershipGuard)
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserDTO> {
        const existingUser = await this.userService.findOne(id);

        if (!existingUser)
            throw new NotFoundException(`User with id : ${id} not found.`);

        return existingUser;
    }

    @Get(':id/profile')
    @UseGuards(OwnershipGuard)
    async findUserWithProfile(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<UserWithProfileAndAddressDTO | null> {
        const user = await this.userProfileService.findUserWithProfile(id);

        if (!user)
            throw new NotFoundException(`User with id : ${id} not found.`);

        return user;
    }

    @Patch(':id')
    @UseGuards(OwnershipGuard)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        //Check if the User exist

        await this.userService.validateUser(id);

        if (updateUserDto.email)
            //Check if the email is already used
            await this.userService.validateEmail(id, updateUserDto.email);

        // if (updateUserDto.password)
        //     updateUserDto.password = await this.authService.hash(
        //         updateUserDto.password,
        //     );

        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @UseGuards(OwnershipGuard)
    async remove(@Param('id', ParseIntPipe) id: number) {
        //Check if the User exist
        await this.userService.validateUser(id);

        await this.userService.remove(id);

        return { message: 'User deleted successfully.' };
    }
}
