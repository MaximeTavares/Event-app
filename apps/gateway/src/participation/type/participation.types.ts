import { ParticipationStatus } from '../dto/participation.dto';

export interface ParticipationWithStatusAndOrganizer {
    userId: string;
    status: ParticipationStatus;
    event: {
        organizerId: string;
    };
}
