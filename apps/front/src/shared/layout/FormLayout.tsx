import type { ReactNode } from 'react';

interface FormLayoutProps {
    title: string;
    children: ReactNode;
    width?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'modal';
}

const widthMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
} as const;

export function FormLayout({
    title,
    children,
    width = 'md',
    variant = 'default',
}: Readonly<FormLayoutProps>) {
    const widthClass = variant === 'modal' ? 'w-full' : widthMap[width];

    return (
        <fieldset
            className={`
                border-2
                fieldset
                bg-base-200
                border-base-300
                rounded-box
                border
                p-6
                flex
                flex-col
                gap-4
                mx-auto
                ${widthClass}
            `}
        >
            <h1 className="text-center text-primary text-3xl font-bold">{title}</h1>
            {children}
        </fieldset>
    );
}
