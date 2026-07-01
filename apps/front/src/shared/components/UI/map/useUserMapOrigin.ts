// Voir src/docs/create-map-geoapify.md, etape 8, pour l'explication detaillee du calcul de l'origine de carte.
import { useMemo } from 'react';
import type { ProfileDto } from '@app/contracts';
import type { UserOrigin } from './map-data';
import { toUserOrigin } from './map-data';

export function useUserMapOrigin(profile: ProfileDto | null | undefined): UserOrigin | null {
    return useMemo(() => {
        if (!profile) return null;

        return toUserOrigin(profile);
    }, [profile]);
}
