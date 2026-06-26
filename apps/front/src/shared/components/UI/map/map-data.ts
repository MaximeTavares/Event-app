// Voir src/docs/create-map-geoapify.md, section Donnees minimales nécessaires, pour l'explication detaillee des helpers de mapping carte.
import type { ProfileDto } from '@app/contracts';
import type { BaseEvent } from '../../../../features/event/types/event.type';

export type Coordinates = { lat: number; lon: number };
export type UserOrigin = Coordinates;
export type EventMapPoint = Pick<BaseEvent, 'id' | 'title'> & Coordinates;

export function toUserOrigin(profile: ProfileDto | null | undefined): UserOrigin | null {
    const coordinates = profile?.address?.coordinates;

    if (!coordinates) return null;

    return {
        lat: coordinates.lat,
        lon: coordinates.lon,
    };
}

export function toEventMapPoints(events: BaseEvent[]): EventMapPoint[] {
    return events
        .filter(
            (
                event,
            ): event is BaseEvent & {
                address: NonNullable<BaseEvent['address']> & {
                    coordinates: { lat: number; lon: number };
                };
            } => !!event.address?.coordinates?.lat && !!event.address?.coordinates?.lon,
        )
        .map(
            (event): EventMapPoint => ({
                id: event.id,
                title: event.title,
                lat: event.address.coordinates.lat,
                lon: event.address.coordinates.lon,
            }),
        );
}

/**
 * Calcule la distance en kilomètres entre deux points géographiques
 * en utilisant la formule de Haversine.
 *
 * Cette formule prend en compte la courbure de la Terre afin de fournir
 * une distance "à vol d'oiseau" plus précise qu'un simple calcul Euclidien.
 *
 * @param origin - Point de depart
 * @param target - Point d'arrivee
 * @returns distance en kilometres
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

function toRadians(value: number): number {
    return (value * Math.PI) / 180;
}
