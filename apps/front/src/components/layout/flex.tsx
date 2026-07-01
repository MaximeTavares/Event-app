import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const flexVariants = cva('flex', {
    variants: {
        direction: {
            row: 'flex-row',
            column: 'flex-col',
            'row-reverse': 'flex-row-reverse',
            'column-reverse': 'flex-col-reverse',
        },
        align: {
            start: 'items-start',
            center: 'items-center',
            end: 'items-end',
            baseline: 'items-baseline',
            stretch: 'items-stretch',
        },
        justify: {
            start: 'justify-start',
            center: 'justify-center',
            end: 'justify-end',
            between: 'justify-between',
            around: 'justify-around',
        },
        wrap: {
            nowrap: 'flex-nowrap',
            wrap: 'flex-wrap',
            'wrap-reverse': 'flex-wrap-reverse',
        },
        gap: {
            '0': 'gap-0',
            '1': 'gap-1',
            '2': 'gap-2',
            '3': 'gap-3',
            '4': 'gap-4',
            '5': 'gap-5',
            '6': 'gap-6',
            '8': 'gap-8',
        },
    },
    defaultVariants: {
        direction: 'row',
        gap: '0',
    },
});

export interface FlexProps
    extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof flexVariants> {
    as?: 'div' | 'section' | 'nav' | 'header' | 'footer' | 'main' | 'ul' | 'li';
}

/**
 * Flex — tout ce que Box fait, plus le contrôle des axes flexbox.
 *
 * Équivalent du Flex de Radix Themes. C'est le composant que tu utiliseras
 * le plus souvent — la majorité des mises en page "simples" (header avec logo
 * à gauche/actions à droite, liste empilée, formulaire en colonne...) passent par lui.
 *
 * @example
 * <Flex direction="column" gap="4">
 *   <Card />
 *   <Card />
 * </Flex>
 *
 * @example
 * <Flex justify="between" align="center">
 *   <Logo />
 *   <UserMenu />
 * </Flex>
 */
export function Flex({
    direction,
    align,
    justify,
    wrap,
    gap,
    as: Component = 'div',
    className,
    ...props
}: Readonly<FlexProps>) {
    return (
        <Component
            className={cn(flexVariants({ direction, align, justify, wrap, gap }), className)}
            {...props}
        />
    );
}
