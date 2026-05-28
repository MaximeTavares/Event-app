import { Outlet } from 'react-router';

export function AuthLayout() {
    return (
        <div className="bg-base-100 min-h-screen flex items-center justify-center">
            <Outlet />
        </div>
    );
}
