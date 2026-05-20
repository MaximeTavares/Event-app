import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import type {
	BaseMission,
	MissionDetailsApiResponse,
	UpdateMissionInput,
} from "../types/mission.type";
import { MissionApi } from "../api/mission.api";
import type { MissionCreationFormValues } from "../validation/MissionCreation.schema";

export function useGetMissionById(id: number): UseQueryResult<MissionDetailsApiResponse, Error> {
	return useQuery({
		queryKey: ["mission", id],
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
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["events", variables.eventId] });
		},
		onError: (error) => {
			console.error("Échec de la création :", error.message);
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
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["mission"] });
		},
		onError: (error) => {
			console.error("Échec de la mise à jour :", error.message);
		},
	});
}

export function useDeleteMission(): UseMutationResult<void, Error, { id: number }> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (variables) => MissionApi.deleteMission(variables.id),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["mission"] });
			queryClient.removeQueries({ queryKey: ["mission", variables.id] });
		},
		onError: (error) => {
			console.error("Échec de la suppression :", error.message);
		},
	});
}
