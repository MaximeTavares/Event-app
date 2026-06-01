import type { ReactNode } from 'react';

interface FormLayoutProps {
    title: string;
    children: ReactNode;
    width?: 'sm' | 'md' | 'lg' | 'xl';
}

const widthMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
};

export function FormLayout({ title, children, width = 'md' }: Readonly<FormLayoutProps>) {
    return (
        <fieldset
            className={`fieldset bg-base-200 border-base-300 rounded-box w-full border p-6 flex flex-col gap-4 ${widthMap[width]}`}
        >
            <h1 className="text-center text-primary text-3xl font-bold">{title}</h1>
            {children}
        </fieldset>
    );
}
