// import { Availability } from '@prisma/client';
// import {
//     defaultMeSettings,
//     WEEK_DAYS,
//     type WeekDay,
// } from '../dto/me-settings.dto';

// /** Semaine de référence (lun–dim) pour stocker les jours disponibles comme créneaux template. */
// const REFERENCE_WEEK_START_UTC = Date.UTC(2024, 0, 1, 8, 0, 0);
// const SLOT_DURATION_MS = 9 * 60 * 60 * 1000;

// const DAY_OFFSET: Record<WeekDay, number> = {
//     monday: 0,
//     tuesday: 1,
//     wednesday: 2,
//     thursday: 3,
//     friday: 4,
//     saturday: 5,
//     sunday: 6,
// };

// const UTC_DAY_TO_WEEKDAY: Record<number, WeekDay> = {
//     0: 'sunday',
//     1: 'monday',
//     2: 'tuesday',
//     3: 'wednesday',
//     4: 'thursday',
//     5: 'friday',
//     6: 'saturday',
// };

// export function isTemplateAvailability(startAt: Date): boolean {
//     const year = startAt.getUTCFullYear();
//     const month = startAt.getUTCMonth();
//     const date = startAt.getUTCDate();
//     return year === 2024 && month === 0 && date >= 1 && date <= 7;
// }

// export function templateSlotRange(day: WeekDay): {
//     start_at: Date;
//     end_at: Date;
// } {
//     const dayMs = 24 * 60 * 60 * 1000;
//     const start_at = new Date(
//         REFERENCE_WEEK_START_UTC + DAY_OFFSET[day] * dayMs,
//     );
//     const end_at = new Date(start_at.getTime() + SLOT_DURATION_MS);
//     return { start_at, end_at };
// }

// export function deriveWeekDaysFromAvailabilities(
//     rows: Pick<Availability, 'start_at'>[],
// ): Record<WeekDay, boolean> {
//     const availability = { ...defaultMeSettings().availability };

//     for (const row of rows) {
//         const key = UTC_DAY_TO_WEEKDAY[row.start_at.getUTCDay()];
//         if (key) availability[key] = true;
//     }

//     return availability;
// }

// export function normalizeAvailabilityPatch(
//     patch: Partial<Record<WeekDay, boolean>>,
// ): Record<WeekDay, boolean> {
//     const base = { ...defaultMeSettings().availability };
//     for (const day of WEEK_DAYS) {
//         if (typeof patch[day] === 'boolean') {
//             base[day] = patch[day];
//         }
//     }
//     return base;
// }
