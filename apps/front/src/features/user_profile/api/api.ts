// import axios from "axios";
import { fakeUsersWithProfileAndAddress } from "../../user/api/fakeUserData";
import type { UserWithProfileAndAddress } from "../types/types";

// const API_URL = "";

// a supprimer lors de la connexion a l'API Back
export async function getCurrentUserWithProfileAndAddress(): Promise<UserWithProfileAndAddress | null> {
	// const { data } = await axios.get<UserWithProfileAndAddress>(`${API_URL}/user-profile/me`);

	// Fake Data
	await new Promise((resolve) => setTimeout(resolve, 200));

	return fakeUsersWithProfileAndAddress[0] ?? null;
}
