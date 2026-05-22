import type { EventStatus } from '../../../../features/event/types/event.type';

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

export default function FilterStatus({
    options,
    status,
    onChange,
    label,
    className = '',
}: FilterStatusProps) {
    return (
        <div className={className}>
            <label className="flex flex-col items-start">
                <span className="label text-xs">{label || 'Status'}</span>
                <select
                    className="select"
                    value={status ?? ''}
                    onChange={(e) => onChange((e.target.value as EventStatus) || null)}
                >
                    <option value="">Tous</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}
