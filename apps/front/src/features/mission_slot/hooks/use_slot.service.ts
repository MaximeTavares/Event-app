import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationResult,
    type UseQueryResult,
} from '@tanstack/react-query';
import { SlotApi } from '../api/slot.api';
import { SlotDetails, SlotFormValues } from '@app/contracts';
import { queryKeys } from '../../../shared/tanstack/QueryKeys';

export function useGetSlot(id: number): UseQueryResult<SlotDetails, Error> {
    return useQuery({
        queryKey: queryKeys.slot(id),
        queryFn: () => SlotApi.getSlotById(id),
        enabled: !!id,
    });
}

export function useCreateSlot(): UseMutationResult<
    SlotFormValues,
    Error,
    { eventId: number; missionId: number; slot: SlotFormValues }
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables) => SlotApi.createSlot(variables.missionId, variables.slot),
        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({
                queryKey: queryKeys.mission(variables.missionId),
            });
            await queryClient.invalidateQueries({
                queryKey: queryKeys.event(variables.eventId),
            });
        },
        onError: (error) => {
            console.error('Échec de la création :', error.message);
        },
    });
}

export function useUpdateSlot(): UseMutationResult<
    SlotFormValues,
    Error,
    { eventId: number; missionId: number; slotId: number; slot: SlotFormValues }
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables) => SlotApi.updateSlot(variables.slotId, variables.slot),
        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({ queryKey: queryKeys.slot(variables.slotId) });
            await queryClient.invalidateQueries({
                queryKey: queryKeys.mission(variables.missionId),
            });
            await queryClient.invalidateQueries({ queryKey: queryKeys.event(variables.eventId) });
        },
        onError: (error) => {
            console.error('Échec de la mise à jour :', error.message);
        },
    });
}

export function useDeleteSlot(): UseMutationResult<
    void,
    Error,
    { eventId: number; missionId: number; slotId: number }
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables) => SlotApi.deleteSlot(variables.slotId),
        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({ queryKey: queryKeys.slot(variables.slotId) });
            queryClient.removeQueries({ queryKey: queryKeys.slot(variables.slotId) });
            await queryClient.invalidateQueries({
                queryKey: queryKeys.mission(variables.missionId),
            });
            await queryClient.invalidateQueries({ queryKey: queryKeys.event(variables.eventId) });
        },
        onError: (error) => {
            console.error('Échec de la suppression :', error.message);
        },
    });
}
