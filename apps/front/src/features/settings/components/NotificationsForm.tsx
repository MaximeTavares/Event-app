import { NotificationsDto, notificationsSchema } from '@app/contracts';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Button from '../../../shared/components/UI/Button';

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

type NotificationsFormProps = {
    onSubmit: (data: NotificationsDto) => Promise<void>;
    isSubmitting?: boolean;
    error?: string;
    defaultValues: NotificationsDto;
};

export function NotificationsForm({
    onSubmit,
    isSubmitting,
    defaultValues,
    error,
}: Readonly<NotificationsFormProps>) {
    const { register, handleSubmit } = useForm<NotificationsDto>({
        resolver: zodResolver(notificationsSchema),
        defaultValues,
    });

    return (
        <form className="flex max-w-xl flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
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

            {error && <p className="text-error text-sm">{error}</p>}

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enregistrement…' : 'Enregister'}
            </Button>
        </form>
    );
}
