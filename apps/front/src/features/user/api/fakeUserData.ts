import type { User } from "../types/user.type";
import type { UserWithProfileAndAddress } from "../../user_profile/types/types";

//Données de test pour l'erreur de connexion
export const fakeUser: User = {
	id: 1,
	name: "John",
	email: "test@test.com",
	role: "User",
};

export const fakeUsersWithProfileAndAddress: UserWithProfileAndAddress[] = [
	{
		user: {
			id: 1,
			name: "Sophie Martin",
			email: "sophie.martin@help.fr",
			role: "Utilisateur",
		},
		profile: {
			firstName: "Sophie",
			lastName: "Martin",
			phoneNumber: "0601020304",
			bio: "Bénévole orientée coordination et accueil.",
			avatarUrl: null,
			createdAt: new Date(2025, 10, 15),
			updatedAt: new Date(2026, 1, 12),
			fullName: "Sophie Martin",
			age: 29,
		},
		address: {
			street_number: 13,
			street_name: "Rue des Lilas",
			city: "Paris",
			postal_code: 75011,
			country: "France",
			coordinates: {
				lat: 48.8566,
				lon: 2.3522,
			},
		},
	},
	{
		user: {
			id: 2,
			name: "Karim Benali",
			email: "karim.benali@help.fr",
			role: "Utilisateur",
		},
		profile: {
			firstName: "Karim",
			lastName: "Benali",
			phoneNumber: "0605060708",
			bio: "Référent logistique et technique.",
			avatarUrl: null,
			createdAt: new Date(2025, 9, 21),
			updatedAt: new Date(2026, 2, 3),
			fullName: "Karim Benali",
			age: 34,
		},
		address: {
			street_number: 8,
			street_name: "Rue de la République",
			city: "Lyon",
			postal_code: 69001,
			country: "France",
			coordinates: {
				lat: 45.764,
				lon: 4.8357,
			},
		},
	},
	{
		user: {
			id: 3,
			name: "Julie Moreau",
			email: "julie.moreau@help.fr",
			role: "Utilisateur",
		},
		profile: {
			firstName: "Julie",
			lastName: "Moreau",
			phoneNumber: "0611223344",
			bio: "Référente animation événementielle.",
			avatarUrl: null,
			createdAt: new Date(2025, 7, 4),
			updatedAt: new Date(2026, 0, 18),
			fullName: "Julie Moreau",
			age: 31,
		},
		address: {
			street_number: 120,
			street_name: "Boulevard Gambetta",
			city: "Lille",
			postal_code: 59000,
			country: "France",
			coordinates: {
				lat: 50.6292,
				lon: 3.0573,
			},
		},
	},
	{
		user: {
			id: 4,
			name: "Louis Leroy",
			email: "louis.leroy@help.fr",
			role: "Utilisateur",
		},
		profile: {
			firstName: "Louis",
			lastName: "Leroy",
			phoneNumber: "0699887766",
			bio: "Coordinateur conférences et partenariats.",
			avatarUrl: null,
			createdAt: new Date(2025, 11, 2),
			updatedAt: new Date(2026, 2, 28),
			fullName: "Louis Leroy",
			age: 37,
		},
		address: {
			street_number: 1,
			street_name: "Avenue des Champs-Élysées",
			city: "Paris",
			postal_code: 75008,
			country: "France",
			coordinates: {
				lat: 48.8698,
				lon: 2.3078,
			},
		},
	},
];
