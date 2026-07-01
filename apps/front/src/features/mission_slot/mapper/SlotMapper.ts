import { SlotCreationInputValues, SlotDetails } from '@app/contracts';
import { formatForInput } from '../../../shared/utils/formatDate';

export class SlotMapper {
    static toDefaultValues(slot: SlotDetails): SlotCreationInputValues {
        return {
            status: slot.status,
            start_at: formatForInput(slot.start_at),
            end_at: formatForInput(slot.end_at),
            max_participant: slot.max_participant,
        };
    }
}
