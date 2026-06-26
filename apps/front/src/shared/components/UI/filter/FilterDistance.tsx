import type { EventFilters } from './eventsFilters.interface';
import { Slider } from '@/components/ui/slider';
import { Field, FieldLabel } from '@/components/ui/field';

type FilterCity = NonNullable<EventFilters['city']>;
type FilterDistanceKm = NonNullable<EventFilters['distanceKm']>;

type FilterDistanceProps = {
    city: FilterCity;
    distanceKm: FilterDistanceKm;
    onChange: (distanceKm: FilterDistanceKm) => void;
    className?: string;
};

const STEPS = [0, 25, 50, 75, 100];

export default function FilterDistance({
    city,
    distanceKm,
    onChange,
    className,
}: Readonly<FilterDistanceProps>) {
    const handleDistanceChange = (value: number[]) => {
        onChange(value[0]);
    };

    return (
        <Field className={className}>
            <FieldLabel>
                Distance{' '}
                {city && (
                    <>
                        autour de <b>{city}</b>
                    </>
                )}
            </FieldLabel>

            <div className="w-full max-w-xs">
                <Slider
                    value={[distanceKm]}
                    min={0}
                    max={100}
                    step={25}
                    onValueChange={handleDistanceChange}
                />
                <div className="flex justify-between px-1 mt-2">
                    {STEPS.map((step) => (
                        <span key={step} className="text-sm text-muted-foreground">
                            {step}
                        </span>
                    ))}
                </div>
            </div>
        </Field>
    );
}
