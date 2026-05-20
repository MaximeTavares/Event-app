import * as yup from "yup";

//Schéma Yup pour l'inscription
export const loginSchema = yup.object({
	email: yup.string().required("Email requis").email("Email invalide."),

	password: yup.string().required("Mot de passe requis."),
});
