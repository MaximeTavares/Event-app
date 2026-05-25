import { User } from '@prisma/client';
import { UserDTO } from '../dto/user.dto';

export function mapUser(user: Omit<User, 'password_hash'>): UserDTO {
    return {
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
    };
}
