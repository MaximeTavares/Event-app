import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { SecurityDto, SecuritySchema } from '@app/contracts';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type SecurityFormProps = {
    onSubmit: (data: SecurityDto) => Promise<void>;
    isSubmitting?: boolean;
    error?: string;
    defaultValues: SecurityDto;
};

export function SecurityForm({
    onSubmit,
    isSubmitting,
    defaultValues,
    error,
    className,
    ...props
}: Readonly<SecurityFormProps & Omit<React.ComponentProps<'div'>, 'onSubmit'>>) {
    const {
        control,
        handleSubmit,
        formState: { isDirty },
    } = useForm<SecurityDto>({
        resolver: zodResolver(SecuritySchema),
        defaultValues,
    });

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Sécurité</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="security-form" onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="twoFactorEnabled"
                                control={control}
                                render={({ field }) => (
                                    <Field>
                                        <div className="flex items-center justify-between rounded-lg border p-4">
                                            <div className="flex flex-col gap-1">
                                                <FieldLabel htmlFor={field.name}>
                                                    Authentification à deux facteurs
                                                </FieldLabel>
                                                <span className="text-sm text-muted-foreground">
                                                    Ajoute une couche de sécurité supplémentaire à
                                                    votre compte.
                                                </span>
                                            </div>
                                            <Switch
                                                id={field.name}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="shrink-0"
                                            />
                                        </div>
                                    </Field>
                                )}
                            />

                            {error && <p className="text-sm text-destructive">{error}</p>}
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        form="security-form"
                        type="submit"
                        disabled={isSubmitting || !isDirty}
                    >
                        {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
