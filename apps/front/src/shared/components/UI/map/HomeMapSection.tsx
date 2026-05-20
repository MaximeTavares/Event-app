// Voir src/docs/create-map-geoapify.md, étapes 5.4 et 5.5, pour l'explication detaillee de l'affichage conditionnel de la carte.
import type { EventMapPoint, UserOrigin } from "./map-data";
import UserEventsMap from "./UserEventsMap";


type HomeMapSectionProps = {
	mapWarningMessage: string | null;
	isMapVisible: boolean;
	isEventsLoading: boolean;
	isEventsError: boolean;
	mapStatusMessage: string | null;
	effectiveOrigin: UserOrigin | null;
	eventMapPoints: EventMapPoint[];
	radiusMeters: number;
};

export default function HomeMapSection({
	mapWarningMessage,
	isMapVisible,
	isEventsLoading,
	isEventsError,
	mapStatusMessage,
	effectiveOrigin,
	eventMapPoints,
	radiusMeters,
}: HomeMapSectionProps) {
	return (
		<>
			{mapWarningMessage ? <div>{mapWarningMessage}</div> : null}

			{isMapVisible && !isEventsLoading && !isEventsError && !mapStatusMessage && effectiveOrigin ? (
				<UserEventsMap searchOrigin={effectiveOrigin} events={eventMapPoints} radiusMeters={radiusMeters} />
			) : isMapVisible && mapStatusMessage ? (
				<div>{mapStatusMessage}</div>
			) : null}
		</>
	);
}