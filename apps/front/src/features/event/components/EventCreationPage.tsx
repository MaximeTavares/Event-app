import { useNavigate } from 'react-router';
import { useCreateEvent } from '../hooks/use_event.service';
import { EventCreationForm } from './EventCreationForm';
import type { EventCreationFormValues } from '../validation/eventCreation.schema';
import { Container } from '@/components/layout/Container';
import { toastMutation } from '@/shared/utils/useToastMutation';

export type ApiError = {
    message: string;
};

export function EventCreationPage() {
    //Navigate
    const navigate = useNavigate();

    //Ecriture Tanstack Mutation
    const createMutation = useCreateEvent();

    const handleSubmit = async (data: EventCreationFormValues) => {
        try {
            await toastMutation(createMutation.mutateAsync(data), {
                loading: 'Chargement...',
                success: 'Evènement créé avec succés',
                error: "Impossible d'enregistrer",
            });
            await navigate('/me/events');
        } catch {
            // handle by toast
        }
    };

    return (
        <Container size={'3'} align={'center'}>
            <EventCreationForm
                onSubmit={handleSubmit}
                isSubmitting={createMutation.isPending}
                error={createMutation.isError ? "Impossible d'enregistrer l'évènement'" : undefined}
            />
        </Container>
    );
}
