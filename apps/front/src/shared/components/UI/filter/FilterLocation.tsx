import type { EventFilters } from './eventsFilters.interface';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type FilterCity = NonNullable<EventFilters['city']>;

type FilterLocationProps = {
    city: FilterCity;
    onChange: (city: FilterCity) => void;
    className?: string;
};

export default function FilterLocation({
    city,
    onChange,
    className,
}: Readonly<FilterLocationProps>) {
    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <Field className={className}>
            <FieldLabel>Ville</FieldLabel>
            <Input
                type="text"
                placeholder="Ville"
                className="w-full max-w-xs"
                value={city}
                onChange={handleCityChange}
            />
        </Field>
    );
}
