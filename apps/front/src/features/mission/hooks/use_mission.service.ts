import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationResult,
    type UseQueryResult,
} from '@tanstack/react-query';
import { MissionApi } from '../api/mission.api';
import { MissionCreationFormValues, MissionDetailsDto } from '@app/contracts';
import { queryKeys } from '../../../shared/tanstack/QueryKeys';

export function useGetMissionById(id: number): UseQueryResult<MissionDetailsDto, Error> {
    return useQuery({
        queryKey: queryKeys.mission(id),
        queryFn: () => MissionApi.getMissionById(id),
        enabled: !!id,
    });
}

export function useCreateMission(): UseMutationResult<
    MissionCreationFormValues,
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
    MissionCreationFormValues,
    Error,
    { eventId: number; missionId: number; data: MissionCreationFormValues }
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables) => MissionApi.updateMission(variables.missionId, variables.data),
        onSuccess: async (_, variables) => {
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

export function useDeleteMission(): UseMutationResult<
    void,
    Error,
    { eventId: number; missionId: number }
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables) => MissionApi.deleteMission(variables.missionId),
        onSuccess: async (_data, variables) => {
            queryClient.removeQueries({ queryKey: queryKeys.mission(variables.missionId) });
            await queryClient.invalidateQueries({ queryKey: queryKeys.event(variables.eventId) });
        },
        onError: (error) => {
            console.error('Échec de la suppression :', error.message);
        },
    });
}
