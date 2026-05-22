import type { Role, User } from '../../user/types/user.type';

export interface SignupData {
    email: string;
    password: string;
}

export interface SignupFormData {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface SigninData {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
}

// export interface AuthResponse {
//     accessToken: string;
//     user: {
//         id: string;
//         email: string;
//         role: 'USER';
//     };
// }

// export interface AuthResponse {
//     data: {
//         user: User;
//         accessToken: string;
//     };
//     timeStamp: string;
//     url: string;
// }

export interface MeResponse {
    id: string;
    email: string;
    role: Role;
}
