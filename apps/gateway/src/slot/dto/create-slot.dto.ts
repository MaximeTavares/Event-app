import { IsDateString, IsEnum, IsInt, Min } from 'class-validator';

enum Slot_status {
    OPEN = 'OPEN',
    FULL = 'FULL',
    CLOSED = 'CLOSED',
    CANCELLED = 'CANCELLED',
}
export class CreateSlotDto {
    @IsEnum(Slot_status)
    status: Slot_status;

    @IsDateString()
    start_at: Date;

    @IsDateString()
    end_at: Date;

    @IsInt()
    @Min(1)
    max_participant: number;
}
