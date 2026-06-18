import { api } from '../../../shared/utils/axios-client';

export class ParticipationApi {
    static async createParticipation(slotId: number) {
        const { data } = await api.post(`slots/${slotId}/participate`);
        return data;
    }
}
