/**
 * Permet de gérer la structure du token
 */
export interface JwtPayload {
    sub: string;
    email: string;
    role: Role;
    iat?: number;
    exp?: number;
}

export type Role = 'USER';

/**
 * Structure du payload tel qu'on la retrouve dans la `request.user` après
 * que le `AuthGard` a décodé le token
 */
export interface AuthUser {
    id: number;
    email: string;
}

export interface SessionResponse {
    accessToken: string;
    user: 'USER' | 'PLATEFORME_ADMIN';
}
