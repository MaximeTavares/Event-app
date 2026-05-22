import { useForm } from 'react-hook-form';
import {
    eventCreationSchema,
    type EventCreationFormValues,
} from '../validation/eventCreation.schema';
import { FormField } from '../../../shared/components/UI/formField/FormField';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventStatusLabel, eventStatusOptions } from '../types/event.type';

type EventCreationFormProps = {
    onSubmit: (data: EventCreationFormValues) => Promise<void>;
    isSubmitting?: boolean;
    error?: string | null;
};

export function EventCreationForm({
    onSubmit,
    isSubmitting,
    error,
}: Readonly<EventCreationFormProps>) {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<EventCreationFormValues>({
        resolver: zodResolver(eventCreationSchema),
        mode: 'onChange',
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField label={'Title'} error={errors.title?.message} {...register('title')} />

            <FormField
                as="textarea"
                label="Description"
                error={errors.description?.message}
                {...register('description')}
            />

            <FormField
                as="textarea"
                label="Programme"
                rows={6}
                error={errors.program?.message}
                {...register('program')}
            />

            <div className="flex justify-center gap-3">
                <div className="flex-1">
                    <FormField
                        data-cy="start-date"
                        type="date"
                        label="Date de début"
                        error={errors.start_date?.message}
                        {...register('start_date')}
                    />
                </div>
                <div className="flex-1">
                    <FormField
                        data-cy="end-date"
                        type="date"
                        label="Date de fin"
                        error={errors.end_date?.message}
                        {...register('end_date')}
                    />
                </div>
            </div>

            <FormField
                as="select"
                label={'Status'}
                defaultValue={'Brouillon'}
                error={errors.status?.message}
                {...register('status')}
            >
                {eventStatusOptions.map((status) => (
                    <option key={status} value={status}>
                        {eventStatusLabel[status]}
                    </option>
                ))}
            </FormField>

            <div>
                <p className="label p-1 text-lg">Adresse</p>

                <div className="flex gap-3">
                    <FormField
                        data-cy="address-number"
                        label="Numéro"
                        error={errors.address?.street_number?.message}
                        {...register('address.street_number')}
                    />
                    <div className="flex-1">
                        <FormField
                            data-cy="address-street-name"
                            label="Nom de rue"
                            error={errors.address?.street_name?.message}
                            {...register('address.street_name')}
                        />
                    </div>
                </div>

                <FormField
                    data-cy="address-line2"
                    label="Complément d'adresse"
                    error={errors.address?.address_line_2?.message}
                    {...register('address.address_line_2')}
                />

                <div className="flex justify-between gap-3">
                    <div className="flex-1">
                        <FormField
                            data-cy="address-pc"
                            label="Code postal"
                            error={errors.address?.postal_code?.message}
                            {...register('address.postal_code')}
                        />
                    </div>
                    <div className="flex-1">
                        <FormField
                            data-cy="city"
                            label="Ville"
                            error={errors.address?.city?.message}
                            {...register('address.city')}
                        />
                    </div>
                </div>
                <FormField
                    data-cy="country"
                    label="Pays"
                    error={errors.address?.country?.message}
                    {...register('address.country')}
                />
            </div>

            {error && <p className="text-error text-sm">{error}</p>}

            <button
                data-cy="submit-event"
                className="btn btn-neutral mt-2 w-full"
                disabled={!isValid || isSubmitting}
            >
                {isSubmitting ? 'Création...' : "Créer l'évènement"}
            </button>
        </form>
    );
}
