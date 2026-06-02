import { Navigate, Outlet } from 'react-router';
import { useMe } from '../../features/auth/hooks/use_auth.service';
import { useAuthStore } from '../../features/auth/store/auth.store';

type Props = {
    allowedRoles?: string[];
};

export default function PrivateRoute({ allowedRoles }: Readonly<Props>) {
    const { data: user, isLoading } = useMe();
    const initialized = useAuthStore((s) => s.initialized);

    if (!initialized || isLoading) return null;
    if (!user) return <Navigate to="/" replace />;

    //  mauvais rôle
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
