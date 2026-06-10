import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../../shared/components/UI/Button';
import { useSettings, useUpdateNotifications } from '../hooks/use_settings.service';
import { NotificationsDto, notificationsSchema } from '@app/contracts';
import { zodResolver } from '@hookform/resolvers/zod';

const rows: { key: keyof NotificationsDto; label: string; description?: string }[] = [
    {
        key: 'enabled',
        label: 'Activer les notifications',
        description: 'Coupe toutes les alertes si désactivé.',
    },
    { key: 'eventActivity', label: 'Activités des événements' },
    { key: 'eventMessages', label: 'Messages dans l’événement' },
    { key: 'documents', label: 'Documents et ressources' },
    { key: 'deadlines', label: 'Échéances et rappels' },
    { key: 'nearbyEvents', label: 'Événements à proximité' },
    { key: 'judgments', label: 'Retours et évaluations reçus' },
];

export default function NotificationsSetting() {
    const { data, isPending, isError, refetch } = useSettings();
    const updateNotifications = useUpdateNotifications();

    const { register, handleSubmit, reset } = useForm<NotificationsDto>({
        resolver: zodResolver(notificationsSchema),
        defaultValues: data?.notifications,
    });

    useEffect(() => {
        if (data?.notifications) {
            reset(data.notifications);
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
            className="flex max-w-xl flex-col gap-6"
            onSubmit={handleSubmit((values) => updateNotifications.mutate(values))}
        >
            <h2 className="text-xl font-semibold">Notifications</h2>

            <ul className="flex flex-col gap-4">
                {rows.map(({ key, label, description }) => (
                    <li
                        key={key}
                        className="flex flex-col gap-1 rounded-lg border border-base-300 p-4"
                    >
                        <label className="flex cursor-pointer items-start gap-3">
                            <input
                                type="checkbox"
                                className="toggle toggle-primary mt-0.5 shrink-0"
                                {...register(key)}
                            />
                            <span>
                                <span className="font-medium">{label}</span>
                                {description ? (
                                    <span className="mt-1 block text-sm text-base-content/70">
                                        {description}
                                    </span>
                                ) : null}
                            </span>
                        </label>
                    </li>
                ))}
            </ul>

            <Button type="submit" disabled={updateNotifications.isPending}>
                {updateNotifications.isPending ? 'Enregistrement…' : 'Sauvegarder'}
            </Button>
        </form>
    );
}
