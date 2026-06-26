import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export interface FilterDateValue {
    start: string | null;
    end: string | null;
}

interface FilterDateProps {
    value: FilterDateValue;
    onChange: (value: FilterDateValue) => void;
    label?: string;
    className?: string;
}

export default function FilterDate({
    value,
    onChange,
    label,
    className,
}: Readonly<FilterDateProps>) {
    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ start: e.target.value || null, end: value.end });
    };
    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ start: value.start, end: e.target.value || null });
    };

    return (
        <div className={`flex gap-2 items-end ${className ?? ''}`}>
            <Field>
                <FieldLabel htmlFor="startDate">Date de début</FieldLabel>
                <Input
                    id="startDate"
                    type="date"
                    value={value.start || ''}
                    onChange={handleStartChange}
                    max={value.end || undefined}
                    aria-label={label ? `${label} (début)` : 'Date de début'}
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="endDate">Date de fin</FieldLabel>
                <Input
                    id="endDate"
                    type="date"
                    value={value.end || ''}
                    onChange={handleEndChange}
                    min={value.start || undefined}
                    aria-label={label ? `${label} (fin)` : 'Date de fin'}
                />
            </Field>
        </div>
    );
}
