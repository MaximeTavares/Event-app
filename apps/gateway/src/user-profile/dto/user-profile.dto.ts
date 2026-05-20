import { AddressDTO } from 'src/address/dto/address.dto';
import { UserDTO } from 'src/user/dto/user.dto';

export type UserProfileDTO = {
    first_name?: string | null;
    last_name?: string | null;
    phone_number?: string | null;
    birthdate?: Date | null;
    bio?: string | null;
    avatar_url?: string | null;
    created_at?: Date;
    updated_at?: Date | null;
    //Données calculées
    full_name?: string | null;
    age?: number | null;
};

export type UserWithProfileAndAddressDTO = {
    user: UserDTO;
    profile: UserProfileDTO | null;
    address: AddressDTO | null;
};
