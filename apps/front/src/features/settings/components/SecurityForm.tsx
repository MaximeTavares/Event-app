import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Button from '../../../shared/components/UI/Button';
import { SecurityDto, SecuritySchema } from '@app/contracts';

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
}: Readonly<SecurityFormProps>) {
    const { register, handleSubmit } = useForm<SecurityDto>({
        resolver: zodResolver(SecuritySchema),
        defaultValues,
    });

    return (
        <div className="flex max-w-xl flex-col gap-10">
            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Authentification à deux facteurs (2FA)</h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <label className="flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            {...register('twoFactorEnabled')}
                        />
                        <span>Activer l’A2F sur mon compte</span>
                    </label>

                    {error && <p className="text-error text-sm">{error}</p>}

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
                    </Button>
                </form>
            </section>
        </div>
    );
}
