// Voir src/docs/create-map-geoapify.md, surtout les étapes 5.1 a 5.4 et 9.1 a 9.4, pour l'explication detaillee de cette integration carte/Geoapify.
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useGetEvents } from '../features/event/hooks/use_event.service';
import type { EventFilters } from '../shared/components/UI/filter/eventsFilters.interface';
import HomeFilters, { type LocationState } from '../shared/components/UI/filter/HomeFilters';
import { toEventMapPoints } from '../shared/components/UI/map/map-data';
import { geocodeCity } from '../shared/utils/map/GeocodeGeoapify';
import {
    buildListStatusMessage,
    buildMapStatusMessage,
    buildMapWarningMessage,
} from '../shared/utils/map/mapUiMessages';
import HomeMapSection from '../shared/components/UI/map/HomeMapSection';
import HomeEventsList from '../features/event/components/HomeEventsList';
import { useProfile } from '@/features/settings/hooks/use-profile';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { useUserMapOrigin } from '@/shared/components/UI/map/useUserMapOrigin';

export default function Home() {
    // État local des filtres, de l'affichage carte et de la pagination.
    const [search, setSearch] = useState('');
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
    } = useProfile();

    // État derive pour savoir si une ville a ete renseignée.
    const hasCityFilter = location.city.trim().length > 0;

    // Geocodage de la ville saisie pour alimenter les filtres spatiaux et la carte.
    const { data: cityCoordinates } = useQuery({
        queryKey: ['geocode-city', location.city.trim()],
        queryFn: () => geocodeCity(location.city.trim()),
        enabled: hasCityFilter,
    });

    // Origine géographique : coordonnées du profil utilisateur (geocodees a la
    // sauvegarde du profil cote backend), utilisees comme repli si aucune ville
    // n'est recherchee explicitement.
    const userOrigin = useUserMapOrigin(currentUser);
    const effectiveOrigin = cityCoordinates ?? userOrigin;

    // Filtres paginés utilisés pour la liste affichée dans la Home.
    // Seuls les évènements OPEN sont affichés sur la Home
    const filters = useMemo<EventFilters>(() => {
        const hasRadiusFilter = location.city.trim().length > 0 && location.distanceKm > 0;

        return {
            statuses: ['OPEN'],
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
    }, [filterDateValue, location, currentPage, effectiveOrigin]);

    // Chargement des donnees évènements, avec et sans pagination.
    const {
        data,
        isLoading: isEventsLoading,
        isError: isEventsError,
        error: eventsError,
    } = useGetEvents(filters);

    const events = data?.items ?? [];
    const total = data?.total ?? 0;
    const limit = data?.limit ?? pageSize;

    // Recherche texte appliquée côté client sur les évènements déjà chargés (titre/description).
    const searchedEvents = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return events;

        return events.filter((event) => {
            const title = event.title?.toLowerCase() ?? '';
            const description = event.description?.toLowerCase() ?? '';
            return title.includes(term) || description.includes(term);
        });
    }, [events, search]);

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(total / limit));
    }, [total, limit]);

    // Données dérivées pour la carte et la pagination de la liste.
    const eventMapPoints = useMemo(() => {
        return toEventMapPoints(searchedEvents);
    }, [searchedEvents]);

    // Messages dérivés affichés dans la carte et la liste.
    const mapStatusMessage = buildMapStatusMessage({
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

    const mapWarningMessage = buildMapWarningMessage({
        hasCityFilter,
        isCityGeocodingError: false,
        isCityNotFound: false,
        hasUserOrigin: Boolean(userOrigin),
    });

    const listStatusMessage = buildListStatusMessage({
        isEventsLoading,
        isEventsError,
        eventsErrorMessage: eventsError?.message,
        displayedEventsCount: searchedEvents.length,
        radiusMeters: location.distanceKm * 1000,
        showRadiusEmptyMessage: Boolean(location.distanceKm),
    });

    return (
        <Container align={'center'} size={'4'}>
            <Section size={'1'}>
                <HomeFilters
                    search={search}
                    onSearchChange={setSearch}
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
                        setFilterDateValue({ start: null, end: null });
                        setLocation({ city: '', distanceKm: 0 });
                    }}
                />
            </Section>
            <Section size={'1'}>
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
            </Section>
            <Section size={'1'}>
                <HomeEventsList
                    listStatusMessage={listStatusMessage}
                    events={searchedEvents}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </Section>
        </Container>
    );
}
