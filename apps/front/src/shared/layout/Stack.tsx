import type { ReactNode } from 'react';

export function Stack({ children }: Readonly<{ children: ReactNode }>) {
    return <div className="flex flex-col gap-4 w-full">{children}</div>;
}
