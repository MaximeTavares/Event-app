import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum Mission_status {
    OPEN = 'OPEN',
    FULL = 'FULL',
    COMPLETED = 'COMPLETED',
}
export class CreateMissionDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    description: string;

    @IsEnum(Mission_status)
    status: Mission_status;
}
