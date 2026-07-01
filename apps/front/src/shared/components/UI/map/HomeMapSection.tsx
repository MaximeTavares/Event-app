// Voir src/docs/create-map-geoapify.md, étapes 5.4 et 5.5, pour l'explication detaillee de l'affichage conditionnel de la carte.
import UiMessageAlert from '@/components/ui-message-alert';
import type { EventMapPoint, UserOrigin } from './map-data';
import UserEventsMap from './UserEventsMap';
import { UiMessage } from '@/shared/utils/map/mapUiMessages';

type HomeMapSectionProps = {
    isMapVisible: boolean;
    isEventsLoading: boolean;
    isEventsError: boolean;
    mapStatusMessage: UiMessage;
    effectiveOrigin: UserOrigin | null | undefined;
    eventMapPoints: EventMapPoint[];
    radiusMeters: number;
};

export default function HomeMapSection({
    isMapVisible,
    isEventsLoading,
    isEventsError,
    mapStatusMessage,
    effectiveOrigin,
    eventMapPoints,
    radiusMeters,
}: Readonly<HomeMapSectionProps>) {
    return (
        <>
            {isMapVisible &&
            !isEventsLoading &&
            !isEventsError &&
            !mapStatusMessage &&
            effectiveOrigin ? (
                <UserEventsMap
                    searchOrigin={effectiveOrigin}
                    events={eventMapPoints}
                    radiusMeters={radiusMeters}
                />
            ) : isMapVisible && mapStatusMessage ? (
                <div>
                    <UiMessageAlert message={mapStatusMessage} />
                </div>
            ) : null}
        </>
    );
}
