import type { EventFilters } from './eventsFilters.interface';

type FilterCity = NonNullable<EventFilters['city']>;

type FilterLocationProps = {
    city: FilterCity;
    onChange: (city: FilterCity) => void;
};

export default function FilterLocation({ city, onChange }: FilterLocationProps) {
    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div>
            <label className="flex flex-col items-start">
                <span className="label text-xs">Ville</span>
                <input
                    type="text"
                    placeholder="Ville"
                    className="input"
                    value={city}
                    onChange={handleCityChange}
                />
            </label>
        </div>
    );
}
