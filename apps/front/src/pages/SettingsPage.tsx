import { Outlet } from 'react-router';
import { SettingsNav } from '@/components/settings-nav';
import { Container } from '@/components/layout/container';

export default function SettingsPage() {
    return (
        <Container>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight">Paramètres</h1>
                <p className="text-sm text-muted-foreground">
                    Gérez votre profil, vos préférences et la sécurité de votre compte.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr]">
                <SettingsNav />
                <div className="min-w-0">
                    <Outlet />
                </div>
            </div>
        </Container>
    );
}
