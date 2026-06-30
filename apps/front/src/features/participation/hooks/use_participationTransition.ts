import { toastMutation } from '../../../shared/utils/useToastMutation';
import { useParticipationUpdate } from './use_participation.service';

export type TransitionAction = 'accept' | 'reject' | 'cancel';

const TRANSITION_MESSAGES: Record<TransitionAction, { success: string }> = {
    accept: { success: 'Participation acceptée avec succés' },
    reject: { success: 'Participation rejetée avec succés' },
    cancel: { success: 'Participation annulée avec succés' },
};

export function useParticipationTransitions(slotId: number, missionId: number, eventId: number) {
    const accept = useParticipationUpdate('accept', { slotId, missionId, eventId });
    const reject = useParticipationUpdate('reject', { slotId, missionId, eventId });
    const cancel = useParticipationUpdate('cancel', { slotId, missionId, eventId });

    const mutations = { accept, reject, cancel };

    const handle = async (action: TransitionAction, participationId: number) => {
        await toastMutation(mutations[action].mutateAsync(participationId), {
            loading: 'Chargement...',
            success: TRANSITION_MESSAGES[action].success,
            error: 'Une erreur est survenue, veuillez essayer à nouveau.',
        });
    };

    return {
        handleAction: (action: TransitionAction, id: number) => handle(action, id),
        isPending: accept.isPending || reject.isPending || cancel.isPending,
    };
}
