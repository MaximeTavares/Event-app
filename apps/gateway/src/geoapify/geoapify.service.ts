import { Injectable } from '@nestjs/common';
import { GeocodeDto } from './dto/geocode.dto';
import { ConfigService } from '@nestjs/config';
import {
    Coordinates,
    GeoapifyGeoResponse,
    GeoapifyResponse,
} from './type/geoapify.type';

/**
 * Génère la requête d'adresse pour l'API Geoapify
 * ------------------------------------------------
 * transforme une adresse en string
 * nettoie les valeurs vides
 * formate pour une API externe
 * @param {GeocodeDto} address
 * @return {*}  {string}
 */
function queryAddress(address: GeocodeDto): string {
    return [
        address.street_number,
        address.street_name,
        address.address_line_2,
        address.postal_code,
        address.city,
        address.country,
    ]
        .filter((v) => v && String(v).trim() !== '')
        .join(', ');
}

@Injectable()
export class GeoapifyService {
    private readonly apiKey: string;

    constructor(private configService: ConfigService) {
        /**
         * Configuration via ConfigService (recommandé avec NestJS)
         *
         * Pourquoi ne pas utiliser process.env directement ?
         * -------------------------------------------------
         * - Permet d’injecter les variables d’environnement via le système de dépendances de NestJS
         * - Facilite les tests (possibilité de mock facilement ConfigService)
         * - Centralise la configuration de l’application (via ConfigModule)
         * - Permet de valider les variables d’environnement au démarrage (ex: avec Joi)
         * - Supporte facilement plusieurs environnements (.env, .env.dev, .env.prod)
         */
        const apiKey = this.configService.get<string>('GEOAPIFY_API_KEY');

        if (!apiKey) {
            throw new Error('GEOAPIFY_API_KEY manquante');
        }

        this.apiKey = apiKey;
    }

    /**
     * Géocode une adresse via l’API Geoapify
     * --------------------------------------
     *
     * Cette méthode transforme une adresse (DTO) en coordonnées GPS (latitude / longitude).
     *
     * Étapes du processus :
     * 1. Transformation de l’adresse en chaîne de requête exploitable par l’API
     * 2. Appel HTTP vers Geoapify Geocoding API
     * 3. Vérification de la réponse HTTP
     * 4. Parsing de la réponse (gestion de deux formats possibles : results ou features)
     * 5. Extraction des coordonnées GPS
     *
     * Gestion des cas :
     * - Retourne null si aucune adresse valide ou aucun résultat trouvé
     * - Supporte deux formats de réponse Geoapify :
     *   • format "results" (API classique)
     *   • format "features" (GeoJSON fallback)
     *
     * Gestion des erreurs :
     * - Erreur levée si l’API Geoapify est inaccessible
     * - Erreur levée si un problème réseau ou parsing survient
     * - Logs l’erreur pour faciliter le debug
     *
     * @param address - Adresse à géocoder (DTO)
     * @returns Coordinates { lat, lon } ou null si aucun résultat
     */
    async geocodeAddress(address: GeocodeDto): Promise<Coordinates | null> {
        const query = queryAddress(address);
        if (!query) return null;

        const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&lang=fr&limit=1&apiKey=${this.apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(
                    `Impossible de contacter le service de géocodage (${response.status}).`,
                );
            }

            const result = (await response.json()) as
                | GeoapifyResponse
                | GeoapifyGeoResponse;
            const firstResult =
                'results' in result ? result.results?.[0] : undefined;

            if (firstResult) {
                return {
                    lat: firstResult.lat,
                    lon: firstResult.lon,
                };
            }

            const firstFeatureCoordinates =
                'features' in result
                    ? result.features?.[0]?.geometry?.coordinates
                    : undefined;

            if (
                firstFeatureCoordinates &&
                firstFeatureCoordinates.length >= 2
            ) {
                // ⚠️ Important : GeoapifyGeoResponse
                // - coordinates = [longitude, latitude]
                // - contrairement à "results" qui utilise { lat, lon }
                const [lon, lat] = firstFeatureCoordinates;

                return { lat, lon };
            }

            return null;
        } catch (error) {
            console.error('Erreur geocodeAddress:', error);

            if (error instanceof Error) {
                throw error;
            }

            throw new Error("Impossible de géocoder l'adresse sélectionnée.");
        }
    }
}
