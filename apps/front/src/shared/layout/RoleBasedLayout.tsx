import type { ComponentType } from 'react';
import { Outlet } from 'react-router';
import type { Role } from '../../features/user/types/user.type';
import { useMe } from '../../features/auth/hooks/use_auth.service';

type Props = {
    layouts: Record<Role, ComponentType>;
    fallback?: ComponentType;
};

export default function RoleBasedLayout({ layouts, fallback: Fallback }: Readonly<Props>) {
    const { data: user, isLoading } = useMe();

    if (isLoading) return null;

    // Sélection dynamique du layout selon le rôle
    const Layout = user?.role ? layouts[user.role] : undefined;

    if (Layout) return <Layout />;

    // Layout de fallback si le rôle n'est pas trouvé

    return Fallback ? <Fallback /> : <Outlet />;
}
