import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../../features/auth/store/auth.store';

type Props = {
    allowedRoles?: string[];
};

export default function PrivateRoute({ allowedRoles }: Readonly<Props>) {
    const user = useAuthStore((state) => state.user);

    // Si pas connécté
    if (!user) return <Navigate to="/" replace />;

    // Si mauvais rôle

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
