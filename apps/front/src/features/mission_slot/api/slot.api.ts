import { SlotDetails, SlotFormValues } from '@app/contracts';
import { api } from '../../../shared/utils/axios-client';

export class SlotApi {
    static async getSlotById(slotId: number) {
        const { data } = await api.get<SlotDetails>(`/slots/${slotId}?details=true`);
        return data;
    }

    static async createSlot(missionId: number, slot: SlotFormValues) {
        const { data } = await api.post<void>(`/missions/${missionId}/slots`, slot);
        return data;
    }

    static async updateSlot(slotId: number, slot: SlotFormValues) {
        const { data } = await api.patch<void>(`/slots/${slotId}`, slot);
        return data;
    }

    static async deleteSlot(slotId: number): Promise<void> {
        await api.delete(`/slots/${slotId}`);
    }
}
