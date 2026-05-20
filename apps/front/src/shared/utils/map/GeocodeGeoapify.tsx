// Voir src/docs/create-map-geoapify.md, etape 5.3, pour l'explication detaillee du geocodage Geoapify.
export interface Coordinates {
    lat: number;
    lon: number;
}

type GeoapifyJsonResponse = {
    results: {
        lat: number;
        lon: number;
    }[];
};

type GeoapifyGeoJsonResponse = {
	features?: {
		geometry?: {
			coordinates?: [number, number];
		};
	}[];
};

/**
 * Géocode une ville via l’API Geoapify.
 * Retourne les coordonnées GPS (lat/lon) ou `null` si aucun résultat.
 * Gère les erreurs réseau et les réponses API invalides.
 * 
 * @param city Nom de la ville (ex: "Paris")
 * @returns Promise<Coordinates | null>
 */
export async function geocodeCity(city: string): Promise<Coordinates | null> {
    const normalizedCity = city.trim();

    if (!normalizedCity) return null;

    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    if (!apiKey) throw new Error("La clé API Geoapify n'est pas définie dans .env (VITE_GEOAPIFY_API_KEY)");

    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(normalizedCity)}&lang=fr&limit=10&type=city&filter=countrycode:fr&format=json&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Impossible de contacter le service de géocodage (${response.status}).`);
        }

        const result = (await response.json()) as GeoapifyJsonResponse | GeoapifyGeoJsonResponse;
        const firstResult = "results" in result ? result.results?.[0] : undefined;

        if (firstResult) {
            return {
                lat: firstResult.lat,
                lon: firstResult.lon,
            };
        }

        const firstFeatureCoordinates = "features" in result
			? result.features?.[0]?.geometry?.coordinates
			: undefined;

        if (firstFeatureCoordinates && firstFeatureCoordinates.length >= 2) {
            const [lon, lat] = firstFeatureCoordinates;

            return { lat, lon };
        }

        return null;
    } catch (error) {
        console.error("Erreur geocodeCity:", error);

        if (error instanceof Error) {
            throw error;
        }

        throw new Error("Impossible de géocoder la ville sélectionnée.");
    }
}