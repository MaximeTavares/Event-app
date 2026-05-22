// Voir src/docs/create-map-geoapify.md, section Preparer la configuration Geoapify pour Leaflet et etape 3, pour l'explication detaillee de la configuration Geoapify/Leaflet.
export type GeoapifyMapStyle = 'osm-bright' | 'osm-carto' | 'toner-grey' | 'klokantech-basic';

export interface GeoapifyLeafletTileLayerOptions {
    attribution: string;
    apiKey: string;
    maxZoom: number;
    id: GeoapifyMapStyle;
    url: string;
    baseUrl: string;
    retinaUrl: string;
    isRetina: boolean;
}

export interface GeoapifyMarkerIconOptions {
    type?: 'material' | 'awesome' | 'circle' | 'plain';
    icon?: string;
    iconType?: 'material' | 'awesome';
    text?: string;
    size?: number;
    contentSize?: number;
    color?: string;
    contentColor?: string;
    strokeColor?: string;
    shadowColor?: string;
    noShadow?: boolean;
    noWhiteCircle?: boolean;
}

const GEOAPIFY_MAPS_HOST = 'https://maps.geoapify.com/v1/tile';
const GEOAPIFY_ICON_HOST = 'https://api.geoapify.com/v2/icon';

export const GEOAPIFY_LEAFLET_ATTRIBUTION =
    'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors';

export const GEOAPIFY_LEAFLET_MAX_ZOOM = 20;

/**
 * Construit l’URL des tuiles Geoapify pour la carte.
 * Gère le style de carte et le mode retina (HD).
 * Voir la documentation Geoapify pour les styles disponibles : https://apidocs.geoapify.com/maps/#map-tiles
 *
 * @param {GeoapifyMapStyle} style
 * @param {string} apiKey
 * @param {boolean} [retina=false]
 * @return {*}  {string}
 */
function buildTileUrl(style: GeoapifyMapStyle, apiKey: string, retina = false): string {
    const suffix = retina ? '@2x' : '';
    return `${GEOAPIFY_MAPS_HOST}/${style}/{z}/{x}/{y}${suffix}.png?apiKey=${apiKey}`;
}

/**
 * Crée les options pour la couche de tuiles Geoapify de Leaflet.
 * Récupère la clé API depuis les variables d’environnement.
 * Gère le style de carte et le mode retina (HD).
 * Voir la documentation Geoapify pour les styles disponibles : https://apidocs.geoapify.com/maps/#map-tiles
 *
 * @export
 * @param {string} apiKey
 * @param {GeoapifyMapStyle} [style="osm-bright"]
 * @param {string} [isRetina=typeof window !== "undefined" ? window.devicePixelRatio > 1 : false]
 * @return {*}  {GeoapifyLeafletTileLayerOptions}
 */
export function createGeoapifyLeafletTileLayerOptions(
    apiKey: string,
    style: GeoapifyMapStyle = 'osm-bright',
    isRetina = typeof window !== 'undefined' ? window.devicePixelRatio > 1 : false,
): GeoapifyLeafletTileLayerOptions {
    const baseUrl = buildTileUrl(style, apiKey, false);
    const retinaUrl = buildTileUrl(style, apiKey, true);

    return {
        attribution: GEOAPIFY_LEAFLET_ATTRIBUTION,
        apiKey,
        maxZoom: GEOAPIFY_LEAFLET_MAX_ZOOM,
        id: style,
        url: isRetina ? retinaUrl : baseUrl,
        baseUrl,
        retinaUrl,
        isRetina,
    };
}

/**
 * Retourne la configuration par défaut Leaflet pour Geoapify.
 * Utilise le style fourni ou "osm-bright" par défaut.
 * Vérifie la présence de la clé API.
 *
 * @export
 * @param {GeoapifyMapStyle} [style="osm-bright"]
 * @return {*}
 */
export function getDefaultGeoapifyLeafletConfig(style: GeoapifyMapStyle = 'osm-bright') {
    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

    if (!apiKey) {
        throw new Error("La clé API Geoapify n'est pas définie dans .env (VITE_GEOAPIFY_API_KEY)");
    }

    return createGeoapifyLeafletTileLayerOptions(apiKey, style);
}

/**
 * Construit l’URL de l’icône de marqueur Geoapify.
 * Gère les options de l’icône et la clé API.
 * Voir la documentation Geoapify pour les options disponibles : https://apidocs.geoapify.com/icon/#icon-api-overview
 *
 * @export
 * @param {GeoapifyMarkerIconOptions} options
 * @return {*}  {string}
 */
export function buildGeoapifyMarkerIconUrl(options: GeoapifyMarkerIconOptions): string {
    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

    if (!apiKey) {
        throw new Error("La clé API Geoapify n'est pas définie dans .env (VITE_GEOAPIFY_API_KEY)");
    }

    const searchParams = new URLSearchParams({
        apiKey,
        type: options.type ?? 'material',
        size: String(options.size ?? 52),
    });

    if (options.icon) searchParams.set('icon', options.icon);
    if (options.iconType) searchParams.set('iconType', options.iconType);
    if (options.text) searchParams.set('text', options.text);
    if (options.contentSize) searchParams.set('contentSize', String(options.contentSize));
    if (options.color) searchParams.set('color', options.color);
    if (options.contentColor) searchParams.set('contentColor', options.contentColor);
    if (options.strokeColor) searchParams.set('strokeColor', options.strokeColor);
    if (options.shadowColor) searchParams.set('shadowColor', options.shadowColor);
    if (options.noShadow) searchParams.set('noShadow', '');
    if (options.noWhiteCircle) searchParams.set('noWhiteCircle', '');

    return `${GEOAPIFY_ICON_HOST}?${searchParams.toString()}`;
}
