import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationResult,
    type UseQueryResult,
} from '@tanstack/react-query';
import type {
    BaseEvent,
    CreateEventInput,
    EventDetailsApiResponse,
    PaginatedEvents,
    UpdateEventInput,
} from '../types/event.type';
import { createEvent, deleteEvent, getEventById, getEvents, updateEvent } from '../api/event.api';
import type { EventFilters } from '../../../shared/components/UI/filter/eventsFilters.interface';
import { EventMapper } from '../mapper/EventMapper';

//Lecture
export function useGetEvents(filters?: EventFilters): UseQueryResult<PaginatedEvents, Error> {
    return useQuery({
        queryKey: ['events', filters],
        queryFn: async () => {
            const res = await getEvents(filters);

            return {
                items: res.items.map(EventMapper.toEvent),
                total: res.total,
                page: res.page,
                limit: res.limit,
            };
        },
    });
}

export function useGetEventById(id: number): UseQueryResult<EventDetailsApiResponse, Error> {
    return useQuery({
        queryKey: ['events', id],
        queryFn: () => getEventById(id),
        enabled: !!id,
    });
}

//Ecriture
export function useCreateEvent(): UseMutationResult<BaseEvent, Error, CreateEventInput> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
        onError: (error) => {
            console.error('Échec de la création :', error.message);
        },
    });
}

export function useUpdateEvent(): UseMutationResult<
    BaseEvent,
    Error,
    { id: number; data: UpdateEventInput }
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables) => updateEvent(variables.id, variables.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
        onError: (error) => {
            console.error('Échec de la mise à jour :', error.message);
        },
    });
}

export function useDeleteEvent(): UseMutationResult<void, Error, { id: number }> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables) => deleteEvent(variables.id),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.removeQueries({ queryKey: ['events', variables.id] });
        },
        onError: (error) => {
            console.error('Échec de la suppression :', error.message);
        },
    });
}
