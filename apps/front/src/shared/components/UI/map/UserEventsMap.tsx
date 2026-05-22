// Voir src/docs/create-map-geoapify.md, étapes 2 a 7 puis etape 4, pour l'explication detaillee du composant de carte et des marqueurs Geoapify.
import { useMemo } from 'react';
import { Icon } from 'leaflet';
import { Circle, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { getDefaultGeoapifyLeafletConfig } from '../../../utils/map/GeoapifyMap';
import type { EventMapPoint, UserOrigin } from './map-data';

type UserEventsMapProps = {
    searchOrigin: UserOrigin;
    events: EventMapPoint[];
    radiusMeters?: number;
};

function buildMarkerIconUrl(apiKey: string, icon: string, color: string): string {
    const searchParams = new URLSearchParams({
        apiKey,
        type: 'material',
        icon,
        iconType: 'material',
        size: '52',
        color,
        contentColor: '#ffffff',
    });

    return `https://api.geoapify.com/v2/icon?${searchParams.toString()}`;
}

export default function UserEventsMap({
    searchOrigin,
    events,
    radiusMeters = 5_000,
}: UserEventsMapProps) {
    const tileLayer = getDefaultGeoapifyLeafletConfig('osm-bright');
    const mapKey = `${searchOrigin.lat}-${searchOrigin.lon}`;
    const userMarkerIcon = useMemo(
        () =>
            new Icon({
                iconUrl: buildMarkerIconUrl(tileLayer.apiKey, 'person', '#2563eb'),
                iconSize: [31, 46],
                iconAnchor: [15, 46],
                popupAnchor: [0, -40],
            }),
        [tileLayer.apiKey],
    );
    const eventMarkerIcon = useMemo(
        () =>
            new Icon({
                iconUrl: buildMarkerIconUrl(tileLayer.apiKey, 'event', '#d97706'),
                iconSize: [31, 46],
                iconAnchor: [15, 46],
                popupAnchor: [0, -40],
            }),
        [tileLayer.apiKey],
    );

    return (
        <MapContainer
            key={mapKey}
            center={[searchOrigin.lat, searchOrigin.lon]}
            zoom={12}
            scrollWheelZoom
            className="h-130 w-full rounded-xl"
        >
            <TileLayer
                attribution={tileLayer.attribution}
                url={tileLayer.url}
                maxZoom={tileLayer.maxZoom}
            />

            <Marker position={[searchOrigin.lat, searchOrigin.lon]} icon={userMarkerIcon}>
                <Popup>Position de l'utilisateur</Popup>
            </Marker>

            {events.map((event: EventMapPoint) => (
                <Marker key={event.id} position={[event.lat, event.lon]} icon={eventMarkerIcon}>
                    <Popup>{event.title}</Popup>
                </Marker>
            ))}

            <Circle
                center={[searchOrigin.lat, searchOrigin.lon]}
                radius={radiusMeters}
                pathOptions={{
                    color: '#0ea5e9',
                    fillColor: '#0ea5e9',
                    fillOpacity: 0.12,
                    weight: 2,
                }}
            />
        </MapContainer>
    );
}
