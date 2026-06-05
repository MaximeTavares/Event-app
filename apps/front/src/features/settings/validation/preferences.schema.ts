import * as yup from 'yup';

export const preferencesSchema = yup.object({
    fontSize: yup.mixed<'sm' | 'md' | 'lg'>().oneOf(['sm', 'md', 'lg']).required(),
    highContrast: yup.boolean().required(),
    timeFormat: yup.mixed<'24' | '12'>().oneOf(['24', '12']).required(),
    dateFormat: yup.mixed<'eu' | 'us'>().oneOf(['eu', 'us']).required(),
    distanceUnit: yup.mixed<'km' | 'mi'>().oneOf(['km', 'mi']).required(),
    language: yup.mixed<'fr' | 'en'>().oneOf(['fr', 'en']).required(),
    profileVisibility: yup
        .mixed<'public' | 'events_only' | 'organizers_only'>()
        .oneOf(['public', 'events_only', 'organizers_only'])
        .required(),
    showEmail: yup.boolean().required(),
    showPhone: yup.boolean().required(),
    defaultCalendarView: yup.string().required(),
    defaultSearchCity: yup.string().default(''),
});
