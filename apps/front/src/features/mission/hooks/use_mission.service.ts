import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationResult,
    type UseQueryResult,
} from '@tanstack/react-query';
import type { BaseMission, UpdateMissionInput } from '../types/mission.type';
import { MissionApi } from '../api/mission.api';
import type { MissionCreationFormValues } from '../validation/MissionCreation.schema';
import { MissionDetailsDto } from '@app/contracts';
import { queryKeys } from '../../../shared/tanstack/QueryKeys';

export function useGetMissionById(id: number): UseQueryResult<MissionDetailsDto, Error> {
    return useQuery({
        queryKey: queryKeys.mission(id),
        queryFn: () => MissionApi.getMissionById(id),
        enabled: !!id,
    });
}

export function useCreateMission(): UseMutationResult<
    BaseMission,
    Error,
    { eventId: number; mission: MissionCreationFormValues }
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables) => MissionApi.createMission(variables.eventId, variables.mission),
        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({ queryKey: queryKeys.event(variables.eventId) });
        },
        onError: (error) => {
            console.error('Échec de la création :', error.message);
        },
    });
}

export function useUpdateMission(): UseMutationResult<
    BaseMission,
    Error,
    { id: number; data: UpdateMissionInput }
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables) => MissionApi.updateMission(variables.id, variables.data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: queryKeys.missions });
        },
        onError: (error) => {
            console.error('Échec de la mise à jour :', error.message);
        },
    });
}

export function useDeleteMission(): UseMutationResult<void, Error, { id: number }> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables) => MissionApi.deleteMission(variables.id),
        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({ queryKey: queryKeys.missions });
            queryClient.removeQueries({ queryKey: queryKeys.mission(variables.id) });
        },
        onError: (error) => {
            console.error('Échec de la suppression :', error.message);
        },
    });
}
