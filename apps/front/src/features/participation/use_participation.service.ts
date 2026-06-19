import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ParticipationApi } from './api/api';

export const useParticipateMutation = (eventId: number, missionId?: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (slotId: number) => ParticipationApi.createParticipation(slotId),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['events', eventId],
            });

            if (missionId) {
                await queryClient.invalidateQueries({
                    queryKey: ['mission', missionId],
                });
            }

            await queryClient.invalidateQueries({
                queryKey: ['me', 'slots'],
            });
        },
    });
};
