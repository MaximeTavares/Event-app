// import { Address, User, User_profile } from '@prisma/client';
// import {
//     defaultMeSettings,
//     type MeSettingsDto,
//     type SettingsAddressDto,
// } from '../dto/me-settings.dto';
// import { deriveWeekDaysFromAvailabilities } from '../utils/availability.util';

// export type UserWithProfile = User & {
//     User_profile:
//         | (User_profile & {
//               Address: Address | null;
//           })
//         | null;
// };

// function mapAddress(address: Address | null): SettingsAddressDto {
//     const base = defaultMeSettings().profile.address;

//     if (!address) return base;

//     return {
//         street_number: address.street_number,
//         street_name: address.street_name,
//         address_line_2: address.address_line_2 ?? undefined,
//         city: address.city,
//         postal_code: address.postal_code,
//         country: address.country,
//         coordinates:
//             address.coordinates_lat != null && address.coordinates_lon != null
//                 ? {
//                       lat: address.coordinates_lat,
//                       lon: address.coordinates_lon,
//                   }
//                 : undefined,
//     };
// }

// export function mapMeSettings(
//     user: UserWithProfile,
//     availabilities: { start_at: Date }[],
// ): MeSettingsDto {
//     const base = defaultMeSettings();
//     const profile = user.User_profile;
//     const address = profile?.Address ?? null;

//     return {
//         ...base,
//         profile: {
//             firstName: profile?.first_name ?? '',
//             lastName: profile?.last_name ?? '',
//             email: user.email,
//             address: mapAddress(address),
//             skills: profile?.bio ?? '',
//         },
//         preferences: {
//             ...base.preferences,
//             showPhone: Boolean(profile?.phone_number),
//             defaultSearchCity: address?.city ?? '',
//         },
//         availability: deriveWeekDaysFromAvailabilities(availabilities),
//     };
// }
