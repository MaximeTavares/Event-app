import { Field, FieldLabel } from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { EventStatus } from '@app/contracts';

export type FilterOption = {
    label: string;
    value: EventStatus;
};

export type FilterStatusProps = {
    options: FilterOption[];
    status: EventStatus | null;
    onChange: (status: EventStatus | null) => void;
    label?: string;
    className?: string;
};

const ALL_VALUE = 'all';

export default function FilterStatus({
    options,
    status,
    onChange,
    label,
    className,
}: Readonly<FilterStatusProps>) {
    const handleValueChange = (value: string) => {
        onChange(value === ALL_VALUE ? null : (value as EventStatus));
    };

    return (
        <Field className={className}>
            <FieldLabel>{label || 'Status'}</FieldLabel>
            <Select value={status ?? ALL_VALUE} onValueChange={handleValueChange}>
                <SelectTrigger className="w-full max-w-xs">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALL_VALUE}>Tous</SelectItem>
                    {options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </Field>
    );
}
