/**
 * Button Component
 * 
 * A versatile button component with multiple variants, sizes, and states.
 * Supports accessibility features and keyboard navigation.
 * 
 * @packageDocumentation
 */

import { Loader2 } from 'lucide-react';
import React, { forwardRef, useMemo } from 'react';

// ============================================
// TYPES
// ============================================

/** Button visual variants */
export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'danger';

/** Button size variants */
export type ButtonSize = 
  | 'sm' 
  | 'md' 
  | 'lg' 
  | 'icon';

/** Button HTML element type */
export type ButtonType = 'button' | 'submit' | 'reset';

/** Interface for Button props */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children?: React.ReactNode;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Whether the button is loading */
  loading?: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button takes full width */
  fullWidth?: boolean;
  /** Icon to display before text */
  leftIcon?: React.ReactNode;
  /** Icon to display after text */
  rightIcon?: React.ReactNode;
  /** Button type attribute */
  type?: ButtonType;
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

// ============================================
// CONSTANTS
// ============================================

/** Size configurations */
const SIZE_CONFIG: Record<ButtonSize, { height: string; paddingX: string; fontSize: string; iconSize: number }> = {
  sm: { height: '2.5rem', paddingX: '1rem', fontSize: '0.875rem', iconSize: 16 },
  md: { height: '3rem', paddingX: '1.5rem', fontSize: '1rem', iconSize: 20 },
  lg: { height: '3.5rem', paddingX: '2rem', fontSize: '1.125rem', iconSize: 24 },
  icon: { height: '2.5rem', paddingX: '0', fontSize: '1rem', iconSize: 20 },
};

/** Variant style classes */
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: `
    bg-[var(--color-primary-500)] text-[var(--color-dark-900)]
    hover:bg-[var(--color-primary-600)] active:bg-[var(--color-primary-700)]
    border border-transparent
    shadow-sm hover:shadow-md
  `,
  secondary: `
    bg-[var(--color-dark-500)] text-white
    hover:bg-[var(--color-dark-600)] active:bg-[var(--color-dark-700)]
    border border-transparent
    shadow-sm hover:shadow-md
  `,
  outline: `
    bg-transparent text-[var(--color-dark-800)]
    hover:bg-[var(--color-dark-100)] active:bg-[var(--color-dark-200)]
    border border-[var(--color-dark-300)] hover:border-[var(--color-dark-400)]
  `,
  ghost: `
    bg-transparent text-[var(--color-dark-600)]
    hover:bg-[var(--color-dark-100)] hover:text-[var(--color-dark-900)]
    border border-transparent
  `,
  danger: `
    bg-[var(--color-error-500)] text-white
    hover:bg-[var(--color-error-600)] active:bg-[var(--color-error-700)]
    border border-transparent
    shadow-sm hover:shadow-md
  `,
};

// ============================================
// HELPER FUNCTION
// ============================================

/**
 * Generates button className string
 */
function getButtonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  loading: boolean,
  disabled: boolean,
  hasIcon: boolean,
  className?: string
): string {
  const sizeConfig = SIZE_CONFIG[size];
  
  return [
    // Base styles
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-lg',
    'transition-all',
    'duration-200',
    'ease-out',
    'focus:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-[var(--color-primary-500)]',
    'focus-visible:ring-offset-2',
    'disabled:opacity-50',
    'disabled:pointer-events-none',
    'disabled:cursor-not-allowed',
    
    // Size styles
    size === 'icon' 
      ? `h-[${sizeConfig.height}] w-[${sizeConfig.height}]`
      : `h-[${sizeConfig.height}] px-[${sizeConfig.paddingX}] text-[${sizeConfig.fontSize}]`,
    
    // Variant styles
    VARIANT_STYLES[variant],
    
    // Full width
    fullWidth && 'w-full',
    
    // Gap between icon and text
    hasIcon && size !== 'icon' && 'gap-2',
    
    // Loading state
    loading && 'cursor-wait',
    
    // Custom className
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

// ============================================
// COMPONENT
// ============================================

/**
 * Button component with comprehensive props support
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="outline" leftIcon={<Icon />}>With Icon</Button>
 * <Button loading>Loading...</Button>
 * ```
 * 
 * @see https://www.w3.org/WAI/ARIA/apg/practices/button-practice/
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
      type = 'button',
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const sizeConfig = SIZE_CONFIG[size];
    const hasIcon = Boolean(leftIcon || rightIcon);
    
    const buttonClasses = useMemo(
      () => getButtonClasses(variant, size, fullWidth, loading, disabled, hasIcon, className),
      [variant, size, fullWidth, loading, disabled, hasIcon, className]
    );
    
    // Loading spinner for accessibility
    const loadingSpinner = (
      <Loader2 
        className="animate-spin" 
        style={{ width: sizeConfig.iconSize, height: sizeConfig.iconSize }}
        aria-hidden="true" 
      />
    );

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        aria-busy={loading}
        aria-disabled={disabled}
        {...props}
      >
        {loading ? (
          <>
            {loadingSpinner}
            <span className="sr-only">Загрузка...</span>
            <span aria-hidden="true" className="invisible">
              {children}
            </span>
          </>
        ) : (
          <>
            {leftIcon && <span style={{ display: 'flex', width: sizeConfig.iconSize }} aria-hidden="true">{leftIcon}</span>}
            {size !== 'icon' && <span>{children}</span>}
            {size === 'icon' && <span className="sr-only">{ariaLabel}</span>}
            {rightIcon && <span style={{ display: 'flex', width: sizeConfig.iconSize }} aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

// Display name for React DevTools
Button.displayName = 'Button';

// ============================================
// SUB-COMPONENTS
// ============================================

/**
 * IconButton - Square button with only an icon
 * 
 * @example
 * ```tsx
 * <IconButton aria-label="Close" onClick={handleClose}>
 *   <XIcon />
 * </IconButton>
 * ```
 */
export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 'aria-label': ariaLabel, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size="icon"
        aria-label={ariaLabel || undefined}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

// ============================================
// DEFAULT EXPORT
// ============================================

export default Button;
