import type { ReactNode } from 'react';

export function PageContainer({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-6xl">{children}</div>
        </div>
    );
}
