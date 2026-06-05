import * as yup from 'yup';

const addressSchema = yup.object({
    street_number: yup.string().required('Le numéro de rue est requis.'),
    street_name: yup.string().required('Le nom de rue est requis.'),
    address_line_2: yup.string().optional(),
    city: yup.string().required('La ville est requise.'),
    postal_code: yup.string().required('Le code postal est requis.'),
    country: yup.string().required('Le pays est requis.'),
});

export const profileSchema = yup.object({
    firstName: yup.string().required('Le prénom est requis.'),
    lastName: yup.string().required('Le nom est requis.'),
    email: yup.string().required("L'email est requis.").email('Email invalide.'),
    address: addressSchema,
    skills: yup.string().default(''),
});
