import { User_role } from '@prisma/client';

export interface UserDTO {
    id: number;
    email: string;
    role: User_role;
    created_at: Date;
    updated_at?: Date | null;
}
