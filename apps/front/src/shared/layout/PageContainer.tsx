// components/layout/page-container.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const pageContainerVariants = cva('w-full px-4 sm:px-6 lg:px-8', {
    variants: {
        align: {
            left: '',
            center: 'mx-auto',
        },
        maxWidth: {
            default: 'max-w-7xl',
            lg: 'max-w-5xl',
            full: 'max-w-none',
        },
    },
    defaultVariants: {
        align: 'left',
        maxWidth: 'default',
    },
});

interface PageContainerProps
    extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof pageContainerVariants> {}

function PageContainer({
    children,
    className,
    align,
    maxWidth,
    ...props
}: Readonly<PageContainerProps>) {
    return (
        <div className={cn(pageContainerVariants({ align, maxWidth }), className)} {...props}>
            {children}
        </div>
    );
}

export { PageContainer };
