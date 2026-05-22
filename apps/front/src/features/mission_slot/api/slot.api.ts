import { api } from '../../../shared/utils/axios-client';
import type { BaseSlot, SlotDetailsApiResponse } from '../types/slot.type';
import type { SlotCreationOutputValues } from '../validation/SlotCreation.schema';

export class SlotApi {
    static async getSlotById(slotId: number): Promise<SlotDetailsApiResponse> {
        const { data } = await api.get(`/slots/${slotId}?details=true`);
        return data;
    }

    static async createSlot(missionId: number, slot: SlotCreationOutputValues): Promise<BaseSlot> {
        const { data } = await api.post(`/missions/${missionId}/slots`, slot);
        return data;
    }

    static async updateSlot(slotId: number, slot: SlotCreationOutputValues): Promise<BaseSlot> {
        const { data } = await api.patch(`/slots/${slotId}`, slot);
        return data;
    }

    static async deleteSlot(slotId: number): Promise<void> {
        await api.delete(`/slots/${slotId}`);
    }
}
