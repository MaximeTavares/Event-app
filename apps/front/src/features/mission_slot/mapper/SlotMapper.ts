import { formatForInput } from '../../../shared/utils/formatDate';
import type { SlotDetailsApiResponse } from '../types/slot.type';
import type { SlotCreationInputValues } from '../validation/SlotCreation.schema';

export class SlotMapper {
    static toDefaultValues(slot: SlotDetailsApiResponse): SlotCreationInputValues {
        return {
            status: slot.status,
            start_at: formatForInput(slot.start_at),
            end_at: formatForInput(slot.end_at),
            max_participant: slot.max_participants,
        };
    }
}
