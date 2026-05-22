import { Outlet } from 'react-router';

export function AuthLayout() {
    return (
        <div className="bg-base-100">
            <main className="flex justify-center items-center h-screen">
                <Outlet />
            </main>
        </div>
    );
}
