import { Outlet } from 'react-router';
import Navbar from '../components/UI/drawer/Navbar';
import Footer from '../components/UI/Footer';

export function PrivateLayout() {
    return (
        <Navbar>
            <div className="min-h-screen flex flex-col bg-base-100">
                <main className="flex-1 w-full p-4">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </Navbar>
    );
}
