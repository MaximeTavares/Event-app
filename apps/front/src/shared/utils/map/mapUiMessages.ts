export type UiMessageSeverity = 'info' | 'warning' | 'error';

export type UiMessage = {
    severity: UiMessageSeverity;
    text: string;
} | null;

type BuildMapStatusMessageParams = {
    hasCityFilter: boolean;
    isUserLoading: boolean;
    isUserError: boolean;
    userErrorMessage?: string;
    hasUserOrigin: boolean;
    hasEffectiveOrigin: boolean;
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
 * Génère le message de statut affiché sur la carte selon l'état :
 * - chargement / erreur du profil utilisateur
 * - disponibilité d'une origine (utilisateur ou ville)
 *
 * Priorité aux erreurs bloquantes. Retourne `null` si tout est OK.
 *
 * Note : les états de géocodage de ville (isCityGeocoding, isCityGeocodingError,
 * isCityNotFound) ont été retirés ici car ils n'étaient jamais branchés côté
 * Home.tsx (toujours codés en dur à false) — à réintroduire le jour où
 * useQuery sur cityCoordinates expose réellement ces états.
 */
export function buildMapStatusMessage(params: BuildMapStatusMessageParams): UiMessage {
    if (params.isUserLoading) {
        return { severity: 'info', text: 'Chargement du profil utilisateur...' };
    }

    if (params.isUserError) {
        return {
            severity: 'error',
            text: params.userErrorMessage ?? 'Impossible de charger le profil utilisateur.',
        };
    }

    if (!params.hasCityFilter && !params.hasUserOrigin) {
        return {
            severity: 'warning',
            text: 'Adresse utilisateur introuvable.\n Veuillez renseigner votre profil ou renseigner une ville dans le formulaire ci-dessus.',
        };
    }

    return null;
}

/**
 * Génère le message de statut de la liste d'événements :
 * - chargement
 * - erreur de récupération
 * - aucun résultat dans un rayon donné
 *
 * Retourne `null` si aucun message n'est nécessaire.
 */
export function buildListStatusMessage(params: BuildListStatusMessageParams): UiMessage {
    if (params.isEventsLoading) {
        return { severity: 'info', text: 'Chargement des événements...' };
    }

    if (params.isEventsError) {
        return {
            severity: 'error',
            text: params.eventsErrorMessage ?? 'Impossible de charger les événements.',
        };
    }

    if (params.showRadiusEmptyMessage && params.displayedEventsCount === 0) {
        return {
            severity: 'info',
            text: `Aucun événement trouvé dans un rayon de ${params.radiusMeters / 1000} km.`,
        };
    }

    return null;
}
