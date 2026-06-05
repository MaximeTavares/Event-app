import * as yup from 'yup';

export const notifySchema = yup.object({
    enabled: yup.boolean().required(),
    eventActivity: yup.boolean().required(),
    eventMessages: yup.boolean().required(),
    documents: yup.boolean().required(),
    deadlines: yup.boolean().required(),
    nearbyEvents: yup.boolean().required(),
    judgments: yup.boolean().required(),
});
