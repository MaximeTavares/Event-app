import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Mission_status } from 'prisma/generated/prisma/enums';

export class CreateMissionDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    description: string;

    @IsEnum(Mission_status)
    status: Mission_status;
}
