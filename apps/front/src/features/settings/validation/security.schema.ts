import * as yup from 'yup';

export const changePasswordSchema = yup.object({
    currentPassword: yup.string().required('Mot de passe actuel requis.'),
    newPassword: yup
        .string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
        .required('Nouveau mot de passe requis.')
        .matches(/(?:.*\d){2,}/, 'Le mot de passe doit contenir au moins 2 chiffres')
        .matches(
            /(?:.*[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]){2,}/,
            'Le mot de passe doit contenir au moins 2 caractères spéciaux',
        ),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Les mots de passe ne correspondent pas')
        .required('Confirmation requise.'),
});

export const securityPreferencesSchema = yup.object({
    twoFactorEnabled: yup.boolean().required(),
});
