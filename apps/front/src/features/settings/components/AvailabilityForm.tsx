import { AvailabilityDto, availabilitySchema } from '@app/contracts';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Button from '../../../shared/components/UI/Button';
import { WeekDay, WEEK_DAYS } from '../types/types';

const DAY_LABELS: Record<WeekDay, string> = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
};

type AvailabilityFormProps = {
    onSubmit: (data: AvailabilityDto) => Promise<void>;
    isSubmitting?: boolean;
    error?: string;
    defaultValues: AvailabilityDto;
};

export function AvailabilityForm({
    onSubmit,
    isSubmitting,
    error,
    defaultValues,
}: Readonly<AvailabilityFormProps>) {
    const { register, handleSubmit } = useForm<AvailabilityDto>({
        resolver: zodResolver(availabilitySchema),
        defaultValues,
    });

    return (
        <form className="flex max-w-xl flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-xl font-semibold">Mes disponibilités</h2>
            <p className="text-sm text-base-content/70">
                Indiquez les jours où vous êtes généralement disponible.
            </p>

            <ul className="flex flex-col gap-3">
                {WEEK_DAYS.map((day) => (
                    <li key={day}>
                        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-base-300 px-4 py-3">
                            <span className="font-medium">{DAY_LABELS[day]}</span>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                {...register(day)}
                            />
                        </label>
                    </li>
                ))}
            </ul>

            {error && <p className="text-error text-sm">{error}</p>}

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
        </form>
    );
}
