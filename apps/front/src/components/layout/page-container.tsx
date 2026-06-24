import { cn } from '@/lib/utils';

// components/layout/page-container.tsx
type PageContainerProps = React.HTMLAttributes<HTMLDivElement>;

function PageContainer({ children, className, ...props }: PageContainerProps) {
    return (
        <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)} {...props}>
            {children}
        </div>
    );
}

export { PageContainer };
