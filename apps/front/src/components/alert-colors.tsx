import { AlertTriangleIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function AlertColors() {
    return (
        <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
            <AlertTriangleIcon />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
                Une erreur est survenue, veuillez recharger la page.
            </AlertDescription>
        </Alert>
    );
}
