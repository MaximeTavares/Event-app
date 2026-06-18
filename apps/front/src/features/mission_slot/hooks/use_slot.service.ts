import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationResult,
    type UseQueryResult,
} from '@tanstack/react-query';
import { SlotApi } from '../api/slot.api';
import type { BaseSlot } from '../types/slot.type';
import type { SlotCreationOutputValues } from '../validation/SlotCreation.schema';
import { SlotDetails } from '@app/contracts';

export function useGetSlot(id: number): UseQueryResult<SlotDetails, Error> {
    return useQuery({
        queryKey: ['slot', id],
        queryFn: () => SlotApi.getSlotById(id),
        enabled: !!id,
    });
}

export function useCreateSlot(): UseMutationResult<
    BaseSlot,
    Error,
    { missionId: number; slot: SlotCreationOutputValues }
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables) => SlotApi.createSlot(variables.missionId, variables.slot),
        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({ queryKey: ['mission', variables.missionId] });
        },
        onError: (error) => {
            console.error('Échec de la création :', error.message);
        },
    });
}

export function useUpdateSlot(): UseMutationResult<
    BaseSlot,
    Error,
    { slotId: number; slot: SlotCreationOutputValues }
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables) => SlotApi.updateSlot(variables.slotId, variables.slot),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['slot'] });
        },
        onError: (error) => {
            console.error('Échec de la mise à jour :', error.message);
        },
    });
}

export function useDeleteSlot(): UseMutationResult<void, Error, { id: number }> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables) => SlotApi.deleteSlot(variables.id),
        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({ queryKey: ['slot'] });
            queryClient.removeQueries({ queryKey: ['slot', variables.id] });
        },
        onError: (error) => {
            console.error('Échec de la suppression :', error.message);
        },
    });
}
