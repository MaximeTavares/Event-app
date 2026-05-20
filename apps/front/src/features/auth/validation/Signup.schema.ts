import * as yup from "yup";

//Schéma Yup pour l'inscription
export const registerSchema = yup
	.object({
		email: yup
			.string()
			.required("Email requis")
			.email("Email invalide.")
			.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email invalide"),

		password: yup
			.string()
			.min(8, "Le mot de passe doit contenir au moins 8 caractères.")
			.required("Mot de passe requis.")
			.matches(/(?:.*\d){2,}/, "Le mot de passe doit contenir au moins 2 chiffres")
			.matches(
				/(?:.*[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]){2,}/,
				"Le mot de passe doit contenir au moins 2 caractères spéciaux",
			),

		confirmPassword: yup
			.string()
			.oneOf([yup.ref("password")], "Les mots de passe ne correspondent pas")
			.required("Confirmation de mot de passe requise."),
	})
	.required();

//Règles pour l'affichange dynamique pendant la saisie
export const passwordRules = (password: string) => ({
	length: password.length >= 8,
	numbers: (password.match(/\d/g) || []).length >= 2,
	specials: (password.match(/[^A-Za-z0-9]/g) || []).length >= 2,
});
