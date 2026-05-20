import { UserDTO } from 'src/user/dto/user.dto';

/**
 * Permet de gérer la structure du token
 */
export type JwtPayload = {
    sub: number;
    iat?: number;
    exp?: number;
};

/**
 * Structure du payload tel qu'on la retrouve dans la `request.user` après
 * que le `AuthGard` a décodé le token
 */
export type AuthUser = {
    id: number;
};

export interface SessionResponse {
    accessToken: string;
    user: Pick<UserDTO, 'role'>;
}
