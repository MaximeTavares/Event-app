export interface FilterDateValue {
    start: string | null;
    end: string | null;
}

interface FilterDateProps {
    value: FilterDateValue;
    onChange: (value: FilterDateValue) => void;
    label?: string;
}

export default function FilterDate({ value, onChange, label }: FilterDateProps) {
    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ start: e.target.value || null, end: value.end });
    };
    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ start: value.start, end: e.target.value || null });
    };

    return (
        <div className="flex gap-2 items-center">            
            <label className="flex flex-col items-start">
                <span className="label text-xs">Date de début</span>
                <input
                    type="date"
                    className="input"
                    value={value.start || ''}
                    onChange={handleStartChange}
                    max={value.end || undefined}
                    aria-label={label ? `${label} (début)` : 'Date de début'}
                />
            </label>
            <label className="flex flex-col items-start">
                <span className="label text-xs">Date de fin</span>
                <input
                    type="date"
                    className="input"
                    value={value.end || ''}
                    onChange={handleEndChange}
                    min={value.start || undefined}
                    aria-label={label ? `${label} (fin)` : 'Date de fin'}
                />
            </label>
        </div>
    );
}