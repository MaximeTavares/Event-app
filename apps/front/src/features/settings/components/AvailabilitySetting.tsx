import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../../../shared/components/UI/Button';
import { availabilitySchema, type AvailabilityForm } from '../validation/availability.schema';
import { usePatchSettings, useSettings } from '../hooks/use_settings.service';
import { mergeMeSettings, WEEK_DAYS, type WeekDay } from '../types/types';

const DAY_LABELS: Record<WeekDay, string> = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
};

export default function AvailabilitySetting() {
    const { data, isPending, isError, refetch } = useSettings();
    const patch = usePatchSettings();
    const merged = mergeMeSettings(data);

    const { register, handleSubmit, reset } = useForm<AvailabilityForm>({
        resolver: yupResolver(availabilitySchema),
        defaultValues: merged.availability,
    });

    useEffect(() => {
        reset(mergeMeSettings(data).availability);
    }, [data, reset]);

    if (isPending) {
        return <p className="text-base-content/70">Chargement…</p>;
    }

    if (isError) {
        return (
            <div className="flex flex-col gap-3">
                <p className="text-error">Impossible de charger vos paramètres.</p>
                <button
                    type="button"
                    className="btn btn-outline btn-sm w-fit"
                    onClick={() => refetch()}
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <form
            className="flex max-w-xl flex-col gap-4"
            onSubmit={handleSubmit((values) => patch.mutate({ availability: values }))}
        >
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

            <Button type="submit" disabled={patch.isPending}>
                {patch.isPending ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
        </form>
    );
}
