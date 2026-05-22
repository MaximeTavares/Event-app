import type { ReactNode } from 'react';
import React from 'react';
import { tv } from 'tailwind-variants';
import type { VariantProps } from 'tailwind-variants';

const buttonVariants = tv({
    base: 'btn',

    variants: {
        variant: {
            primary: 'btn-primary',
            secondary: 'btn-secondary',
            accent: 'btn-accent',
            neutral: 'btn-neutral',
            info: 'btn-info',
            success: 'btn-success',
            warning: 'btn-warning',
            error: 'btn-error',
            ghost: 'btn-ghost',
        },

        size: {
            xs: 'btn-xs',
            sm: 'btn-sm',
            md: 'btn-md',
            lg: 'btn-lg',
        },

        outline: {
            true: 'btn-outline',
        },

        loading: {
            true: 'loading',
        },

        block: {
            true: 'btn-block',
        },

        square: {
            true: 'btn-square',
        },

        circle: {
            true: 'btn-circle',
        },

        disabled: {
            true: 'btn-disabled',
        },
    },
});

// Définition des props du composant Button, avec support du polymorphisme (as) et des variantes Tailwind
// Le type générique Element permet de rendre le composant polymorphe (button, a, etc.)
type ButtonProps<Element extends React.ElementType = 'button'> = VariantProps<
    typeof buttonVariants
> &
    Omit<React.ComponentPropsWithoutRef<Element>, 'as'> & {
        as?: Element; // Permet de changer le type d'élément rendu (button, a, etc.)
        children?: ReactNode; // Contenu du bouton
        className?: string; // Permet d'ajouter des classes CSS personnalisées
        'aria-disabled'?: boolean; // Accessibilité : bouton désactivé
        'aria-busy'?: boolean; // Accessibilité : bouton en chargement
    };

// Élément HTML par défaut utilisé si 'as' n'est pas précisé
const defaultElement = 'button';

// Composant Button polymorphe et accessible
export default function Button<Element extends React.ElementType = typeof defaultElement>({
    as,
    variant = 'primary',
    size = 'md',
    outline,
    loading,
    block,
    square,
    circle,
    disabled,
    className,
    children,
    // ...props va collecter toutes les autres propriétés passées au composant (onClick, type, aria-label, etc.)
    ...props
}: ButtonProps<Element>) {
    // Détermine le type d'élément à rendre (button par défaut, ou autre si 'as' est fourni)
    const Component = as || defaultElement;

    // Génère dynamiquement la classe CSS selon les variantes et options
    const classNames = [
        buttonVariants.base,
        buttonVariants.variants.variant[variant],
        buttonVariants.variants.size[size],
        outline ? buttonVariants.variants.outline.true : '',
        loading ? buttonVariants.variants.loading.true : '',
        block ? buttonVariants.variants.block.true : '',
        square ? buttonVariants.variants.square.true : '',
        circle ? buttonVariants.variants.circle.true : '',
        disabled ? buttonVariants.variants.disabled.true : '',
        className || '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <Component
            className={classNames}
            // Attribut HTML natif pour désactiver le bouton (utile pour <button>)
            disabled={disabled}
            // Attribut d’accessibilité : indique que le bouton est désactivé pour les lecteurs d’écran
            aria-disabled={disabled || undefined}
            // Attribut d’accessibilité : indique que le bouton est en cours de traitement (loading)
            aria-busy={loading || undefined}
            // Passe toutes les autres props collectées (onClick, type, aria-label, etc.)
            {...props}
        >
            {/* Affiche le contenu du bouton */}
            {children}
        </Component>
    );
}
