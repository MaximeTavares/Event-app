import type { EventFilters } from './eventsFilters.interface';

type FilterCity = NonNullable<EventFilters['city']>;
type FilterDistanceKm = NonNullable<EventFilters['distanceKm']>;

type FilterDistanceProps = {
    city: FilterCity;
    distanceKm: FilterDistanceKm;
    onChange: (distanceKm: FilterDistanceKm) => void;
};

export default function FilterDistance({ city, distanceKm, onChange }: FilterDistanceProps) {
    const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(e.target.value));
    };

    return (
        <div>
            <label className="flex flex-col items-start">
                <span className="label text-xs">
                    Distance{' '}
                    {city && (
                        <>
                            autour de <b>{city}</b>
                        </>
                    )}
                </span>
                <div className="w-full max-w-xs">
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={distanceKm}
                        className="range"
                        step={25}
                        list="distance-marks"
                        onChange={handleDistanceChange}
                    />
                    <datalist id="distance-marks">
                        <option value={0} label="0" />
                        <option value={25} label="25" />
                        <option value={50} label="50" />
                        <option value={75} label="75" />
                        <option value={100} label="100" />
                    </datalist>
                    <div className="flex justify-between px-2.5 mt-2 text-xs">
                        <span>0</span>
                        <span>25</span>
                        <span>50</span>
                        <span>75</span>
                        <span>100</span>
                    </div>
                </div>
            </label>
        </div>
    );
}
