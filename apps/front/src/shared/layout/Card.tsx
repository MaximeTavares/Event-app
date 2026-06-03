import type { ReactNode } from 'react';

type CardSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

type CardProps = {
    title?: string;
    children: ReactNode;
    size?: CardSize;
    className?: string;
};

const sizeMap: Record<CardSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-3xl',
    full: 'max-w-full',
};

export function Card({ title, children, size = 'xl', className }: Readonly<CardProps>) {
    return (
        <div
            className={`
                w-full
                mx-auto
                bg-base-200
                border border-base-300
                rounded-box
                p-6
                ${sizeMap[size]}
                ${className ?? ''}
            `}
        >
            {title && <h1 className="text-center text-primary text-3xl font-bold mb-6">{title}</h1>}

            {children}
        </div>
    );
}
