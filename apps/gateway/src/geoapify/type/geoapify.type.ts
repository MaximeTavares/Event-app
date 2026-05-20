export interface Coordinates {
    lat: number;
    lon: number;
}

/**
 * Réponse Geoapify - format "results"
 * -----------------------------------
 * Format standard retourné par l’endpoint :
 * /v1/geocode/search
 *
 * Structure simple et directe :
 * - chaque résultat contient directement lat/lon
 * - utilisé pour les cas de géocodage classiques (forward geocoding)
 */
export type GeoapifyResponse = {
    results: {
        lat: number;
        lon: number;
    }[];
};

/**
 * Réponse Geoapify - format "GeoJSON (features)"
 * ---------------------------------------------
 * Format conforme au standard GeoJSON.
 *
 * Utilisé par certains endpoints Geoapify ou configurations avancées
 * orientées cartographie (SIG / mapping).
 *
 * Structure plus imbriquée :
 * - features[] contient les objets géographiques
 * - geometry.coordinates contient [lon, lat]
 *   ⚠️ attention : ordre inversé par rapport à "results"
 */
export type GeoapifyGeoResponse = {
    features?: {
        geometry?: {
            coordinates?: [number, number];
        };
    }[];
};
