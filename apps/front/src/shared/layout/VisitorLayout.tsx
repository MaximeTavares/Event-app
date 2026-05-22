import { Outlet } from 'react-router';
import VisitorNavbar from '../components/UI/drawer/VisitorNavbar';
import Footer from '../components/UI/Footer';

export function VisitorLayout() {
    return (
        <VisitorNavbar>
            <div className="flex flex-col min-h-screen bg-base-100">
                <main className="flex-1 p-4">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </VisitorNavbar>
    );
}
