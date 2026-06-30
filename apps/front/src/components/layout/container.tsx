import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const containerVariants = cva('w-full px-4 sm:px-6 lg:px-8', {
    variants: {
        size: {
            '1': 'max-w-xl',
            '2': 'max-w-3xl',
            '3': 'max-w-5xl',
            '4': 'max-w-7xl',
            full: 'max-w-none',
        },
        align: {
            left: '',
            center: 'mx-auto',
        },
    },
    defaultVariants: {
        size: '4',
        align: 'left',
    },
});

export interface ContainerProps
    extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {}

/**
 * Container — contraint la largeur maximale du contenu de page.
 *
 * Équivalent du Container de Radix Themes, et généralisation de notre
 * PageContainer existant (même logique de fond, juste renommé/élargi pour
 * couvrir aussi les cas "centré" en plus du cas "aligné à gauche" qu'on a
 * réglé pour les pages avec sidebar).
 *
 * `align: "left"` par défaut — pour les pages avec sidebar (Settings, Dashboard...).
 * `align: "center"` pour les pages autonomes (Signin/Signup, landing...).
 *
 * @example
 * // Page avec sidebar, contenu collé à gauche
 * <Container size="4">...</Container>
 *
 * @example
 * // Page d'auth, contenu centré et étroit
 * <Container size="1" align="center">...</Container>
 */
export function Container({ size, align, className, ...props }: ContainerProps) {
    return <div className={cn(containerVariants({ size, align }), className)} {...props} />;
}
