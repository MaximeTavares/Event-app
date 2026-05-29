// Voir src/docs/create-map-geoapify.md, surtout les étapes 5.1 a 5.4 et 9.1 a 9.4, pour l'explication detaillee de cette integration carte/Geoapify.
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useGetEvents } from '../features/event/hooks/use_event.service';
import { useGetCurrentUserWithProfileAndAddress } from '../features/user_profile/hooks/use_user_profile.service';
import type { EventFilters } from '../shared/components/UI/filter/eventsFilters.interface';
import HomeFilters, { type LocationState } from '../shared/components/UI/filter/HomeFilters';
import { toEventMapPoints } from '../shared/components/UI/map/map-data';
import { useUserMapOrigin } from '../shared/components/UI/map/useUserMapOrigin';
import { geocodeCity } from '../shared/utils/map/GeocodeGeoapify';
import {
    buildListStatusMessage,
    buildMapStatusMessage,
    buildMapWarningMessage,
} from '../shared/utils/map/mapUiMessages';
import HomeMapSection from '../shared/components/UI/map/HomeMapSection';
import HomeEventsList from '../features/event/components/HomeEventsList';
import type { EventStatus } from '../features/event/types/event.type';

const statusOptions: { label: string; value: EventStatus }[] = [
    { label: 'Ouvert', value: 'OPEN' },
    { label: 'Fermé', value: 'CLOSED' },
    { label: 'Annulé', value: 'CANCELLED' },
];

export default function Home() {
    // État local des filtres, de l'affichage carte et de la pagination.
    const [status, setStatus] = useState<EventStatus | null>(null);
    const [location, setLocation] = useState<LocationState>({
        city: '',
        distanceKm: 0,
    });
    const [filterDateValue, setFilterDateValue] = useState<{
        start: string | null;
        end: string | null;
    }>({ start: null, end: null });
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

    const {
        data: currentUser,
        isLoading: isUserLoading,
        isError: isUserError,
        error: userError,
    } = useGetCurrentUserWithProfileAndAddress();

    // État derive pour savoir si une ville a ete renseignée.
    const hasCityFilter = location.city.trim().length > 0;

    // Geocodage de la ville saisie pour alimenter les filtres spatiaux et la carte.
    const { data: cityCoordinates } = useQuery({
        queryKey: ['geocode-city', location.city.trim()],
        queryFn: () => geocodeCity(location.city.trim()),
        enabled: hasCityFilter,
    });

    // Origine géographique et paramètres spatiaux utilisés pour la carte et le filtrage par rayon.
    const userOrigin = useUserMapOrigin(currentUser);
    const effectiveOrigin = cityCoordinates ?? userOrigin;

    // Filtres paginés utilisés pour la liste affichée dans la Home.
    const filters = useMemo<EventFilters>(() => {
        const hasRadiusFilter = location.city.trim().length > 0 && location.distanceKm > 0;

        return {
            // filtre de statut, ou pas de filtre si aucune sélectionnée
            statuses: status ? [status] : undefined,
            startDate: filterDateValue.start ?? undefined,
            endDate: filterDateValue.end ?? undefined,

            // filtre ville (texte uniquement)
            city: location.city || undefined,

            // filtre géo uniquement si valide
            latitude: hasRadiusFilter ? effectiveOrigin?.lat : undefined,
            longitude: hasRadiusFilter ? effectiveOrigin?.lon : undefined,
            distanceKm: hasRadiusFilter ? location.distanceKm : undefined,

            // pagination
            page: currentPage,
            limit: pageSize,
        };
    }, [status, filterDateValue, location, currentPage, effectiveOrigin]);

    // Chargement des donnees évènements, avec et sans pagination, plus l'utilisateur courant.
    const {
        data,
        isLoading: isEventsLoading,
        isError: isEventsError,
        error: eventsError,
    } = useGetEvents(filters);

    const events = data?.items;
    const total = data?.total ?? 0;
    const limit = data?.limit ?? pageSize;

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(total / limit));
    }, [total, limit]);

    // Données dérivées pour la carte et la pagination de la liste.
    const eventMapPoints = useMemo(() => {
        if (!events) return [];
        return toEventMapPoints(events);
    }, [events]);

    // Messages dérivés affichés dans la carte et la liste.
    const mapStatusMessage = useMemo(() => {
        return buildMapStatusMessage({
            hasCityFilter,
            isCityGeocoding: false,
            isCityGeocodingError: false,
            isCityNotFound: false,
            isUserLoading,
            isUserError,
            userErrorMessage: userError?.message,
            hasUserOrigin: Boolean(userOrigin),
            hasEffectiveOrigin: Boolean(effectiveOrigin),
        });
    }, [hasCityFilter, isUserLoading, isUserError, userError, userOrigin, effectiveOrigin]);

    const mapWarningMessage = useMemo(() => {
        return buildMapWarningMessage({
            hasCityFilter,
            isCityGeocodingError: false,
            isCityNotFound: false,
            hasUserOrigin: Boolean(userOrigin),
        });
    }, [hasCityFilter, userOrigin]);

    const listStatusMessage = useMemo(() => {
        return buildListStatusMessage({
            isEventsLoading,
            isEventsError,
            eventsErrorMessage: eventsError?.message,
            displayedEventsCount: events?.length ?? 0,
            radiusMeters: location.distanceKm * 1000,
            showRadiusEmptyMessage: Boolean(location.distanceKm),
        });
    }, [events, isEventsLoading, isEventsError, eventsError, location.distanceKm]);

    return (
        <div className="flex flex-wrap gap-4 space-y-4">
            <HomeFilters
                statusOptions={statusOptions}
                status={status}
                onStatusChange={(value) => {
                    setCurrentPage(1);
                    setStatus(value);
                }}
                location={location}
                onLocationChange={(updater) => {
                    setCurrentPage(1);
                    setLocation((prev) => updater(prev));
                }}
                filterDateValue={filterDateValue}
                onFilterDateValueChange={(value) => {
                    setCurrentPage(1);
                    setFilterDateValue(value);
                }}
                isMapVisible={isMapVisible}
                onToggleMap={() => setIsMapVisible((prev) => !prev)}
                onReset={() => {
                    setCurrentPage(1);
                    setStatus(null);
                    setFilterDateValue({ start: null, end: null });
                    setLocation({ city: '', distanceKm: 0 });
                }}
            />

            <HomeMapSection
                mapWarningMessage={mapWarningMessage}
                isMapVisible={isMapVisible}
                isEventsLoading={isEventsLoading}
                isEventsError={isEventsError}
                mapStatusMessage={mapStatusMessage}
                effectiveOrigin={effectiveOrigin}
                eventMapPoints={eventMapPoints}
                radiusMeters={location.distanceKm * 1000}
            />

            <HomeEventsList
                listStatusMessage={listStatusMessage}
                events={events ?? []}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}
