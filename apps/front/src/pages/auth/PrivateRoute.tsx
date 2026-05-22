import { Navigate, Outlet } from 'react-router';
import { useMe } from '../../features/auth/hooks/use_auth.service';

type Props = {
    allowedRoles?: string[];
};

export default function PrivateRoute({ allowedRoles }: Readonly<Props>) {
    const { data: user } = useMe();

    // Si pas connécté
    if (!user) return <Navigate to="/" replace />;

    // Si mauvais rôle

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
