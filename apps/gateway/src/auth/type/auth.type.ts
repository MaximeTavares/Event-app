/**
 * Permet de gérer la structure du token
 */
export type JwtPayload = {
    sub: number;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
};

export type SigninResponse = {
    accessToken: string;
    refreshToken: string;
};

/**
 * Structure du payload tel qu'on la retrouve dans la `request.user` après
 * que le `AuthGard` a décodé le token
 */
export type AuthUser = {
    id: number;
};

export interface CurrentUserData {
    id: string;
    email: string;
    role: Role;
}

export type Role = 'USER';
