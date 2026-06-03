import { Outlet } from 'react-router';
import Navbar from '../components/UI/drawer/Navbar';
import Footer from '../components/UI/Footer';

export function PrivateLayout() {
    return (
        <Navbar>
            <div className="min-h-screen bg-base-100">
                <main className="w-full p-4">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </Navbar>
    );
}
