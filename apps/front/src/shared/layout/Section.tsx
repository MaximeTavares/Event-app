import type { ReactNode } from 'react';

export function Section({ children }: Readonly<{ children: ReactNode }>) {
    return <div className="w-full flex flex-col gap-6">{children}</div>;
}
