import { MissionCreationFormValues, MissionDetailsDto, MissionDto } from '@app/contracts';
import { api } from '../../../shared/utils/axios-client';

export class MissionApi {
    static async createMission(eventId: number, mission: MissionCreationFormValues) {
        const { data } = await api.post<MissionDto>(`events/${eventId}/missions`, mission);
        return data;
    }

    static async getMissionById(id: number) {
        const { data } = await api.get<MissionDetailsDto>(`/missions/${id}?details=true`);
        return data;
    }

    static async updateMission(id: number, mission: MissionCreationFormValues) {
        const { data } = await api.patch<MissionDto>(`/missions/${id}`, mission);
        return data;
    }

    static async deleteMission(id: number): Promise<void> {
        await api.delete(`/missions/${id}`);
    }
}
