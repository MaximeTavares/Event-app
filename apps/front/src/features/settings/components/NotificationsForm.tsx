import { NotificationsDto, notificationsSchema } from '@app/contracts';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { FieldGroup } from '@/components/ui/field';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const rows: { key: keyof NotificationsDto; label: string; description?: string }[] = [
    {
        key: 'enabled',
        label: 'Activer les notifications',
        description: 'Coupe toutes les alertes si désactivé.',
    },
    { key: 'eventActivity', label: 'Activités des événements' },
    { key: 'eventMessages', label: "Messages dans l'événement" },
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
    className,
    ...props
}: Readonly<NotificationsFormProps & Omit<React.ComponentProps<'div'>, 'onSubmit'>>) {
    const {
        control,
        handleSubmit,
        formState: { isDirty },
    } = useForm<NotificationsDto>({
        resolver: zodResolver(notificationsSchema),
        defaultValues,
    });

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="notifications-form" onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <ul className="flex flex-col gap-3">
                                {rows.map(({ key, label, description }) => (
                                    <li key={key} className="rounded-lg border p-4">
                                        <Controller
                                            name={key}
                                            control={control}
                                            render={({ field }) => (
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-medium">
                                                            {label}
                                                        </span>
                                                        {description && (
                                                            <span className="text-sm text-muted-foreground">
                                                                {description}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <Switch
                                                        id={field.name}
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        className="shrink-0"
                                                    />
                                                </div>
                                            )}
                                        />
                                    </li>
                                ))}
                            </ul>

                            {error && <p className="text-sm text-destructive">{error}</p>}
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        type="submit"
                        form="notifications-form"
                        disabled={isSubmitting || !isDirty}
                    >
                        {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
