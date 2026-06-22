import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/tanstack/QueryKeys';
import { TransitionAction } from './use_participationTransition';
import { ParticipationsApi } from '../api/participation.api';

export const useParticipateMutation = (eventId: number, missionId?: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (slotId: number) => ParticipationsApi.create(slotId),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: queryKeys.event(eventId),
            });

            if (missionId) {
                await queryClient.invalidateQueries({
                    queryKey: queryKeys.mission(missionId),
                });
            }
        },
    });
};

interface UseParticipationTransitionParams {
    slotId: number;
}

export function useParticipationUpdate(
    action: TransitionAction,
    { slotId }: UseParticipationTransitionParams,
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (participationId: number) => ParticipationsApi[action](participationId),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: queryKeys.participationsBySlot(slotId),
                }),
                queryClient.invalidateQueries({
                    queryKey: queryKeys.slot(slotId),
                }),
                queryClient.invalidateQueries({
                    queryKey: queryKeys.slots,
                }),
            ]);
        },
    });
}
