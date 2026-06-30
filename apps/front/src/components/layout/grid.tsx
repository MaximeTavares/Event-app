// components/layout/grid.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const gridVariants = cva('grid gap-4', {
    variants: {
        cols: {
            1: 'grid-cols-1',
            2: 'grid-cols-1 sm:grid-cols-2',
            3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
            4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        },
        gap: {
            sm: 'gap-2',
            md: 'gap-4',
            lg: 'gap-6',
        },
    },
    defaultVariants: {
        cols: 3,
        gap: 'md',
    },
});

interface GridProps
    extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof gridVariants> {}

function Grid({ children, cols, gap, className, ...props }: Readonly<GridProps>) {
    return (
        <div className={cn(gridVariants({ cols, gap }), className)} {...props}>
            {children}
        </div>
    );
}

export { Grid, gridVariants };
