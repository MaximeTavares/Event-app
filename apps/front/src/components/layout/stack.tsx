// components/layout/stack.tsx
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const stackVariants = cva('flex flex-col', {
    variants: {
        gap: {
            sm: 'gap-2',
            md: 'gap-4',
            lg: 'gap-6',
        },
    },
    defaultVariants: { gap: 'md' },
});

interface StackProps
    extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof stackVariants> {}

function Stack({ children, gap, className, ...props }: Readonly<StackProps>) {
    return (
        <div className={cn(stackVariants({ gap }), className)} {...props}>
            {children}
        </div>
    );
}

export { Stack };
