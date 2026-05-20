import { User_role } from 'prisma/generated/prisma/enums';

export type UserDTO = {
    id: number;
    email: string;
    role: User_role;
    created_at: Date;
    updated_at?: Date | null;
};
