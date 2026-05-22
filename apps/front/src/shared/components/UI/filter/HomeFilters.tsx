import { useState } from 'react';
import { GoFilter, GoSearch } from 'react-icons/go';
import Button from '../Button';

import FilterDate from './FilterDate';
import FilterDistance from './FilterDistance';
import FilterLocation from './FilterLocation';
import FilterStatus from './FilterStatus';
import type { EventStatus } from '../../../../features/event/types/event.type';

export type LocationState = {
    city: string;
    distanceKm: number;
};

export type FilterDateValue = {
    start: string | null;
    end: string | null;
};

export type StatusOption = {
    label: string;
    value: EventStatus;
};

type HomeFiltersProps = {
    statusOptions: StatusOption[];
    status: EventStatus | null;
    onStatusChange: (statuses: EventStatus | null) => void;
    location: LocationState;
    onLocationChange: (updater: (prev: LocationState) => LocationState) => void;
    filterDateValue: FilterDateValue;
    onFilterDateValueChange: (value: FilterDateValue) => void;
    isMapVisible: boolean;
    onToggleMap: () => void;
    onReset: () => void;
};

export default function HomeFilters({
    statusOptions,
    status,
    onStatusChange,
    location,
    onLocationChange,
    filterDateValue,
    onFilterDateValueChange,
    isMapVisible,
    onToggleMap,
    onReset,
}: HomeFiltersProps) {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="w-full space-y-3">
            <label className="input w-full">
                <GoSearch className="my-1.5 inline-block size-5" />
                <input type="search" placeholder="Rechercher" />
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => setShowForm((prev) => !prev)}
                >
                    <GoFilter className="my-1.5 inline-block size-5" />
                </Button>
            </label>

            <form
                className={`flex flex-wrap gap-2 items-center ${showForm ? '' : 'hidden'}`}
                onReset={onReset}
            >
                <FilterStatus
                    label="Status"
                    options={statusOptions}
                    status={status}
                    onChange={onStatusChange}
                />

                <FilterLocation
                    city={location.city}
                    onChange={(city) => {
                        onLocationChange((prev) => ({
                            ...prev,
                            city,
                            distanceKm: city.trim() ? prev.distanceKm : 0,
                        }));
                    }}
                />

                <FilterDistance
                    city={location.city}
                    distanceKm={location.distanceKm}
                    onChange={(distanceKm) => {
                        onLocationChange((prev) => ({ ...prev, distanceKm }));
                    }}
                />

                <FilterDate value={filterDateValue} onChange={onFilterDateValueChange} />

                <label className="flex flex-col items-start">
                    <span className="label text-xs">Carte</span>
                    <button type="button" className="btn" onClick={onToggleMap}>
                        {isMapVisible ? 'Masquer' : 'Afficher'}
                    </button>
                </label>

                <label className="flex flex-col items-start">
                    <span className="label text-xs">Reset</span>
                    <input className="btn btn-square" type="reset" value="x" />
                </label>
            </form>
        </div>
    );
}
