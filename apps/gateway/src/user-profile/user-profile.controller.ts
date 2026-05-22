import {
    Controller,
    Post,
    Body,
    Patch,
    Param,
    NotFoundException,
    ConflictException,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserService } from 'src/user/user.service';
import { OwnershipGuard } from 'src/ms-auth/guard/ownership.guard';

@Controller('users')
export class UserProfileController {
    constructor(
        private readonly userProfileService: UserProfileService,
        private readonly userService: UserService,
    ) {}

    @Post(':id/profile')
    @UseGuards(OwnershipGuard)
    async create(
        @Param('id', ParseIntPipe) id: number,
        @Body() createUserProfileDto: CreateUserProfileDto,
    ) {
        const user = await this.userService.countById(id);

        if (!user) throw new NotFoundException('User not found');

        const profile = await this.userProfileService.countProfileById(id);

        if (profile)
            throw new ConflictException(
                'A profile already exist for this user',
            );
        return this.userProfileService.create(id, createUserProfileDto);
    }

    @Patch(':id/profile')
    @UseGuards(OwnershipGuard)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserProfileDto: UpdateUserProfileDto,
    ) {
        const user = await this.userProfileService.countProfileById(id);

        if (!user)
            throw new NotFoundException('There is no profile for this user');

        return this.userProfileService.update(id, updateUserProfileDto);
    }
}
