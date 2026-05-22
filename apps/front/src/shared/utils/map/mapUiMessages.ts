type BuildMapStatusMessageParams = {
    hasCityFilter: boolean;
    isCityGeocoding: boolean;
    isCityGeocodingError: boolean;
    isCityNotFound: boolean;
    isUserLoading: boolean;
    isUserError: boolean;
    userErrorMessage?: string;
    hasUserOrigin: boolean;
    hasEffectiveOrigin: boolean;
};

type BuildMapWarningMessageParams = {
    hasCityFilter: boolean;
    isCityGeocodingError: boolean;
    isCityNotFound: boolean;
    hasUserOrigin: boolean;
};

type BuildListStatusMessageParams = {
    isEventsLoading: boolean;
    isEventsError: boolean;
    eventsErrorMessage?: string;
    displayedEventsCount: number;
    radiusMeters: number;
    showRadiusEmptyMessage: boolean;
};

/**
 * Génère le message de statut affiché sur la carte selon l’état :
 * - chargement / erreur du profil utilisateur
 * - géocodage de la ville
 * - disponibilité d’une origine (utilisateur ou ville)
 *
 * Priorité aux erreurs bloquantes. Retourne `null` si tout est OK.
 *
 * @export
 * @param {BuildMapStatusMessageParams} params
 * @return {*}  {(string | null)}
 */
export function buildMapStatusMessage(params: BuildMapStatusMessageParams): string | null {
    if (params.isUserLoading) {
        return 'Chargement du profil utilisateur...';
    }

    if (params.isUserError) {
        return params.userErrorMessage ?? 'Impossible de charger le profil utilisateur.';
    }

    if (params.isCityGeocoding && !params.hasEffectiveOrigin) {
        return 'Géocodage de la ville en cours...';
    }

    if ((params.isCityGeocodingError || params.isCityNotFound) && !params.hasEffectiveOrigin) {
        return 'Impossible de géocoder la ville sélectionnée.';
    }

    if (!params.hasCityFilter && !params.hasUserOrigin) {
        return 'Adresse utilisateur introuvable.';
    }

    return null;
}

/**
 * Génère un message d’avertissement pour la carte :
 * - en cas d’échec du géocodage de la ville
 * - avec fallback possible sur la position utilisateur
 *
 * Retourne `null` si aucun avertissement n’est nécessaire.
 *
 * @export
 * @param {BuildMapWarningMessageParams} params
 * @return {*}  {(string | null)}
 */
export function buildMapWarningMessage(params: BuildMapWarningMessageParams): string | null {
    if (!params.hasCityFilter) {
        return null;
    }

    if (params.isCityGeocodingError || params.isCityNotFound) {
        return params.hasUserOrigin
            ? 'Impossible de géocoder la ville sélectionnée. La carte reste centrée sur votre adresse.'
            : 'Impossible de géocoder la ville sélectionnée.';
    }

    return null;
}

/**
 * Génère le message de statut de la liste d’événements :
 * - chargement
 * - erreur de récupération
 * - aucun résultat dans un rayon donné
 *
 * Retourne `null` si aucun message n’est nécessaire.
 *
 * @export
 * @param {BuildListStatusMessageParams} params
 * @return {*}  {(string | null)}
 */
export function buildListStatusMessage(params: BuildListStatusMessageParams): string | null {
    if (params.isEventsLoading) {
        return 'Chargement des événements...';
    }

    if (params.isEventsError) {
        return params.eventsErrorMessage ?? 'Impossible de charger les événements.';
    }

    if (params.showRadiusEmptyMessage && params.displayedEventsCount === 0) {
        return `Aucun événement trouvé dans un rayon de ${params.radiusMeters / 1000} km.`;
    }

    return null;
}
