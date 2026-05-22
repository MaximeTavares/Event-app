import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '../../../shared/components/UI/formField/FormField';
import {
    SlotCreationSchema,
    type SlotCreationInputValues,
    type SlotCreationOutputValues,
} from '../validation/SlotCreation.schema';

type SlotCreationFormProps = {
    onSubmit: (data: SlotCreationOutputValues) => Promise<void>;
    isSubmitting?: boolean;
    error?: boolean;
    defaultValues?: SlotCreationInputValues;
};

export function SlotCreationForm({
    onSubmit,
    isSubmitting,
    error,
    defaultValues,
}: Readonly<SlotCreationFormProps>) {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<SlotCreationInputValues, unknown, SlotCreationOutputValues>({
        resolver: zodResolver(SlotCreationSchema),
        mode: 'onChange',
        defaultValues,
    });

    const handleFormSubmit = handleSubmit((data) => {
        return onSubmit(data);
    });

    const isEdit = defaultValues !== undefined;

    let buttonLabel = 'Créer le créneau';

    if (isEdit) {
        buttonLabel = 'Modifier le créneau';
    }

    if (isSubmitting) {
        buttonLabel = isEdit ? 'Mise à jour...' : 'Création...';
    }

    return (
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <FormField
                as="select"
                label="Status"
                defaultValue={'OPEN'}
                error={errors.status?.message}
                {...register('status')}
            >
                <option value={'OPEN'}>Ouvert</option>
                <option value={'CANCELLED'}>Annulé</option>
            </FormField>

            <FormField
                type="datetime-local"
                step="900"
                label="Date de début"
                error={errors.start_at?.message}
                {...register('start_at')}
            />

            <FormField
                type="datetime-local"
                step="900"
                label="Date de fin"
                error={errors.end_at?.message}
                {...register('end_at')}
            />

            <FormField
                label="Nombre maximum de participant"
                error={errors.max_participant?.message}
                {...register('max_participant')}
            />

            {error && <p className="text-error text-sm">{error}</p>}

            <button className="btn btn-neutral mt-2 w-full" disabled={!isValid || isSubmitting}>
                {buttonLabel}
            </button>
        </form>
    );
}
