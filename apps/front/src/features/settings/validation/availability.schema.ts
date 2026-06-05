import * as yup from 'yup';
import type { WeekDay } from '../types/types';

export type AvailabilityForm = Record<WeekDay, boolean>;

export const availabilitySchema: yup.ObjectSchema<AvailabilityForm> = yup
    .object({
        monday: yup.boolean().required(),
        tuesday: yup.boolean().required(),
        wednesday: yup.boolean().required(),
        thursday: yup.boolean().required(),
        friday: yup.boolean().required(),
        saturday: yup.boolean().required(),
        sunday: yup.boolean().required(),
    })
    .required();
