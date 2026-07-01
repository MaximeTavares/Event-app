import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const boxVariants = cva('', {
    variants: {
        display: {
            block: 'block',
            inline: 'inline',
            'inline-block': 'inline-block',
            none: 'hidden',
        },
        position: {
            static: 'static',
            relative: 'relative',
            absolute: 'absolute',
            fixed: 'fixed',
            sticky: 'sticky',
        },
    },
});

export interface BoxProps
    extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof boxVariants> {}

/**
 * Box — la brique de layout la plus basique.
 *
 * Équivalent du Box de Radix Themes : un simple <div> qui sert de point d'accroche
 * pour du spacing (p-4, m-2...), des contraintes de taille (w-full, max-w-md...),
 * ou du contrôle de position (relative, absolute...).
 *
 * Contrairement à Radix Themes, on ne réinvente pas un système de props pour le
 * spacing/sizing : ces classes Tailwind existent déjà et sont accessibles directement
 * via `className`. Box n'expose que `display` et `position` comme variantes typées,
 * parce que ce sont les deux seules choses qu'on retape souvent et qui bénéficient
 * d'une vraie autocomplétion.
 *
 * @example
 * <Box className="p-4 max-w-md">Contenu simple</Box>
 * <Box position="relative" className="h-10">
 *   <Box position="absolute" className="top-0 right-0">Badge</Box>
 * </Box>
 */
export function Box({ display, position, className, ...props }: Readonly<BoxProps>) {
    return <div className={cn(boxVariants({ display, position }), className)} {...props} />;
}
