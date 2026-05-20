// Voir src/docs/create-map-geoapify.md, section Donnees minimales nécessaires, pour l'explication detaillee des helpers de mapping carte.
import type { Coordinates } from "../../../../features/address/types/address.type";
import type { BaseEvent } from "../../../../features/event/types/event.type";
import type { UserWithProfileAndAddress } from "../../../../features/user_profile/types/types";

export type UserOrigin = Coordinates;
export type EventMapPoint = Pick<BaseEvent, "id" | "title"> & Coordinates;

export function toUserOrigin(userProfile: UserWithProfileAndAddress): UserOrigin | null {
	const coordinates = userProfile.address?.coordinates;

	if (!coordinates) return null;

	return {
		lat: coordinates.lat,
		lon: coordinates.lon,
	};
}

export function toEventMapPoints(events: BaseEvent[]): EventMapPoint[] {
	return events
		.filter((event): event is BaseEvent & {
			address: NonNullable<BaseEvent["address"]> & {
				coordinates: { lat: number; lon: number };
			};
		} =>
			!!event.address?.coordinates?.lat &&
			!!event.address?.coordinates?.lon
		)
		.map((event): EventMapPoint => ({
			id: event.id,
			title: event.title,
			lat: event.address.coordinates.lat,
			lon: event.address.coordinates.lon,
		}));
}

/**
 * Calcule la distance en kilomètres entre deux points géographiques
 * en utilisant la formule de Haversine.
 *
 * Cette formule prend en compte la courbure de la Terre afin de fournir
 * une distance "à vol d’oiseau" plus précise qu’un simple calcul Euclidien.
 *
 * Elle est adaptée pour :
 * - les recherches par rayon (ex: événements autour d’une ville)
 * - les systèmes de géolocalisation (maps, proximité, matching)
 * 
 * @export
 * @param {Coordinates} origin
 * @param {Coordinates} target
 * @return {*}  {number}
 */
export function haversineDistance(origin: Coordinates, target: Coordinates): number {
	const earthRadiusKm = 6371;
	const deltaLat = toRadians(target.lat - origin.lat);
	const deltaLon = toRadians(target.lon - origin.lon);
	const originLat = toRadians(origin.lat);
	const targetLat = toRadians(target.lat);
	const a =
		Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
		Math.cos(originLat) * Math.cos(targetLat) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return earthRadiusKm * c;
}

/**
 * Convertit une valeur en degrés vers des radians.
 *
 * Cette conversion est nécessaire pour les calculs trigonométriques
 * (sin, cos, tan), notamment dans les formules géographiques comme
 * la distance de Haversine.
 *
 * @param {number} value - Angle en degrés
 * @return {number} Angle converti en radians
 */
function toRadians(value: number): number {
	return (value * Math.PI) / 180;
}