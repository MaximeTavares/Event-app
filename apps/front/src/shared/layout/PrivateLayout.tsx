import { Outlet } from 'react-router';
import Navbar from '../components/UI/drawer/Navbar';
import Footer from '../components/UI/Footer';

export function PrivateLayout() {
    return (
        <Navbar>
            <div className="flex flex-col min-h-screen bg-base-100">
                <main className="flex-1 p-4">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </Navbar>
    );
}
