/**
 * Permet de gérer la structure du token
 */
export interface JwtPayload {
    sub: number;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

export interface SigninResponse {
    accessToken: string;
    refreshToken: string;
}

/**
 * Structure du payload tel qu'on la retrouve dans la `request.user` après
 * que le `AuthGard` a décodé le token
 */
export interface AuthUser {
    id: number;
}

export interface CurrentUserData {
    id: string;
    email: string;
    role: Role;
}

export type Role = 'USER';
