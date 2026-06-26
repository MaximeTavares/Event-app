import { useState } from 'react';
import { GoFilter } from 'react-icons/go';
import { SearchIcon } from 'lucide-react';

import FilterDate from './FilterDate';
import FilterDistance from './FilterDistance';
import FilterLocation from './FilterLocation';
import { Field, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';

export type LocationState = {
    city: string;
    distanceKm: number;
};

export type FilterDateValue = {
    start: string | null;
    end: string | null;
};

type HomeFiltersProps = {
    search: string;
    onSearchChange: (search: string) => void;
    location: LocationState;
    onLocationChange: (updater: (prev: LocationState) => LocationState) => void;
    filterDateValue: FilterDateValue;
    onFilterDateValueChange: (value: FilterDateValue) => void;
    isMapVisible: boolean;
    onToggleMap: () => void;
    onReset: () => void;
};

export default function HomeFilters({
    search,
    onSearchChange,
    location,
    onLocationChange,
    filterDateValue,
    onFilterDateValueChange,
    isMapVisible,
    onToggleMap,
    onReset,
}: Readonly<HomeFiltersProps>) {
    const [showFilters, setShowFilters] = useState(false);

    const handleReset = () => {
        onSearchChange('');
        onReset();
    };

    return (
        <div className="flex flex-col gap-2">
            <Field>
                <FieldLabel htmlFor="event-search" className="sr-only">
                    Rechercher un événement
                </FieldLabel>
                <InputGroup className="bg-card">
                    <InputGroupAddon align="inline-start">
                        <SearchIcon className="text-muted-foreground" />
                    </InputGroupAddon>
                    <InputGroupInput
                        id="event-search"
                        placeholder="Rechercher un événement..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        aria-pressed={showFilters}
                        aria-label="Afficher les filtres"
                        onClick={() => setShowFilters((prev) => !prev)}
                    >
                        <GoFilter className="size-5" />
                    </Button>
                </InputGroup>
            </Field>

            {showFilters && (
                <form
                    className="flex flex-wrap items-end gap-3 rounded-md border bg-card p-3"
                    onReset={handleReset}
                >
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

                    <Field>
                        <FieldLabel>Carte</FieldLabel>
                        <Button type="button" variant="secondary" onClick={onToggleMap}>
                            {isMapVisible ? 'Masquer la carte' : 'Afficher la carte'}
                        </Button>
                    </Field>

                    <Field>
                        <FieldLabel className="sr-only">Réinitialiser</FieldLabel>
                        <Button type="reset" variant="ghost">
                            Réinitialiser
                        </Button>
                    </Field>
                </form>
            )}
        </div>
    );
}
