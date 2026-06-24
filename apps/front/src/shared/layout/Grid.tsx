import type { ReactNode } from 'react';

export function Grid({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl items-stretch">
            {children}
        </ul>
    );
}
