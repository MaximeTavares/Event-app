// Voir src/docs/create-map-geoapify.md, etape 8, pour l'explication detaillee du calcul de l'origine de carte.
import { useMemo } from "react";
import type { UserWithProfileAndAddress } from "../../../../features/user_profile/types/types";
import type { UserOrigin } from "./map-data";
import { toUserOrigin } from "./map-data";

export function useUserMapOrigin(userWithProfileAndAddress: UserWithProfileAndAddress | null | undefined): UserOrigin | null {
	return useMemo(() => {
		if (!userWithProfileAndAddress) return null;

		return toUserOrigin(userWithProfileAndAddress);
	}, [userWithProfileAndAddress]);
}
