import { Mission } from 'prisma/generated/prisma/client';
import {
    MissionDTO,
    MissionWithDetails,
    MissionWithRelation,
} from '../dto/mission.dto';

export function mapMission(mission: Mission): MissionDTO {
    return {
        id: mission.id,
        event_id: mission.event_id,
        title: mission.title,
        description: mission.description,
        status: mission.status,
        created_at: mission.created_at,
        updated_at: mission.updated_at,
    };
}

export function toMissionDetails(
    mission: MissionWithRelation,
): MissionWithDetails {
    return {
        id: mission.id,
        event_id: mission.event_id,
        organizer_id: mission.Event.user_id,
        title: mission.title,
        description: mission.description,
        status: mission.status,
        slots: mission.Slot.map((s) => ({
            id: s.id,
            start_at: s.start_at,
            end_at: s.end_at,
            max_participants: s.max_participant,
            status: s.status,
            current_participants: s.Participation.length,
            available_place: s.max_participant - s.Participation.length,
            participations: s.Participation.map((p) => ({
                user_id: p.User.id,
                first_name: p.User.User_profile?.first_name,
                last_name: p.User.User_profile?.last_name,
            })),
        })),
    };
}
