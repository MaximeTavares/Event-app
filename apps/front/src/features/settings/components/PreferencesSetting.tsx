import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormField } from '../../../shared/components/UI/formField/FormField';
import Button from '../../../shared/components/UI/Button';
import { preferencesSchema } from '../validation/preferences.schema';
import { useSettings, useUpdatePreferences } from '../hooks/use_settings.service';
import { type MeSettings } from '../types/types';

type PreferencesForm = MeSettings['preferences'];

export default function PreferencesSetting() {
    const { data, isPending, isError, refetch } = useSettings();
    const updatePreferences = useUpdatePreferences();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PreferencesForm>({
        resolver: yupResolver(preferencesSchema),
        defaultValues: data?.preferences,
    });

    useEffect(() => {
        if (data?.preferences) {
            reset(data.preferences);
        }
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
            onSubmit={handleSubmit((values) => updatePreferences.mutate(values))}
        >
            <h2 className="text-xl font-semibold">Préférences</h2>

            <h3 className="text-sm font-semibold uppercase tracking-wide text-base-content/60">
                Affichage
            </h3>
            <FormField
                as="select"
                label="Taille du texte"
                error={errors.fontSize?.message}
                {...register('fontSize')}
            >
                <option value="sm">Petit</option>
                <option value="md">Moyen</option>
                <option value="lg">Grand</option>
            </FormField>

            <label className="flex cursor-pointer items-center gap-3">
                <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    {...register('highContrast')}
                />
                <span>Mode contraste élevé</span>
            </label>

            <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-base-content/60">
                Formats
            </h3>
            <FormField
                as="select"
                label="Format de l’heure"
                error={errors.timeFormat?.message}
                {...register('timeFormat')}
            >
                <option value="24">24 h</option>
                <option value="12">12 h</option>
            </FormField>

            <FormField
                as="select"
                label="Format de date"
                error={errors.dateFormat?.message}
                {...register('dateFormat')}
            >
                <option value="eu">JJ/MM/AAAA</option>
                <option value="us">MM/JJ/AAAA</option>
            </FormField>

            <FormField
                as="select"
                label="Unité de distance"
                error={errors.distanceUnit?.message}
                {...register('distanceUnit')}
            >
                <option value="km">Kilomètres</option>
                <option value="mi">Miles</option>
            </FormField>

            <FormField
                as="select"
                label="Langue"
                error={errors.language?.message}
                {...register('language')}
            >
                <option value="fr">Français</option>
                <option value="en">English</option>
            </FormField>

            <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-base-content/60">
                Confidentialité
            </h3>
            <FormField
                as="select"
                label="Visibilité du profil"
                error={errors.profileVisibility?.message}
                {...register('profileVisibility')}
            >
                <option value="public">Public</option>
                <option value="events_only">Membres de mes événements uniquement</option>
                <option value="organizers_only">Organisateurs uniquement</option>
            </FormField>

            <label className="flex cursor-pointer items-center gap-3">
                <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    {...register('showEmail')}
                />
                <span>Afficher mon email aux autres</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
                <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    {...register('showPhone')}
                />
                <span>Afficher mon téléphone aux autres</span>
            </label>

            <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-base-content/60">
                Navigation
            </h3>
            <FormField
                label="Vue par défaut du calendrier"
                error={errors.defaultCalendarView?.message}
                {...register('defaultCalendarView')}
            />

            <FormField
                label="Ville ou zone de recherche par défaut"
                error={errors.defaultSearchCity?.message}
                {...register('defaultSearchCity')}
            />

            <Button type="submit" disabled={updatePreferences.isPending}>
                {updatePreferences.isPending ? 'Enregistrement…' : 'Sauvegarder'}
            </Button>
        </form>
    );
}
