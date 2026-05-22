import { api } from '../../../shared/utils/axios-client';
import type {
    BaseMission,
    MissionDetailsApiResponse,
    UpdateMissionInput,
} from '../types/mission.type';
import type { MissionCreationFormValues } from '../validation/MissionCreation.schema';

export class MissionApi {
    static async createMission(
        eventId: number,
        mission: MissionCreationFormValues,
    ): Promise<BaseMission> {
        const { data } = await api.post(`events/${eventId}/missions`, mission);
        return data;
    }

    static async getMissionById(id: number) {
        const { data } = await api.get<MissionDetailsApiResponse>(`/missions/${id}?details=true`);
        return data;
    }

    static async updateMission(id: number, mission: UpdateMissionInput): Promise<BaseMission> {
        const { data } = await api.patch(`/missions/${id}`, mission);
        return data;
    }

    static async deleteMission(id: number): Promise<void> {
        await api.delete(`/missions/${id}`);
    }
}
