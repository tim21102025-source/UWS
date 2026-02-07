/**
 * Card Component
 * 
 * A versatile card component with multiple variants and hover effects.
 * 
 * @packageDocumentation
 */

import React from 'react';

/**
 * Combines class names conditionally
 */
function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ============================================
// MAIN CARD
// ============================================

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: 'none' | 'scale' | 'lift' | 'glow';
  clickable?: boolean;
  fullWidth?: boolean;
  radius?: 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

/**
 * Card component with multiple variants and hover effects
 */
export function Card({
  children,
  variant = 'default',
  padding = 'md',
  hover = 'none',
  clickable = false,
  fullWidth = true,
  radius = 'lg',
  className,
  onClick,
}: CardProps) {
  const paddingMap = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };
  const radiusMap = { md: 'rounded-lg', lg: 'rounded-xl', xl: 'rounded-2xl' };
  const hoverMap = { 
    none: '', 
    scale: 'transition-transform duration-300 hover:scale-[1.02]', 
    lift: 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
    glow: 'transition-all duration-300 hover:shadow-xl',
  };
  const variantMap = {
    default: 'shadow-sm',
    bordered: 'border border-dark-200 dark:border-dark-600 shadow-none',
    elevated: 'shadow-lg',
  };

  const Component = clickable ? 'button' : 'div';

  return (
    <Component
      className={cn(
        'relative',
        'overflow-hidden',
        'transition-all',
        'duration-300',
        'ease-out',
        'bg-white',
        'w-full',
        paddingMap[padding],
        radiusMap[radius],
        variantMap[variant],
        hoverMap[hover],
        clickable && 'cursor-pointer text-left border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        fullWidth && 'w-full',
        className
      )}
      onClick={onClick}
      disabled={!clickable}
    >
      {children}
    </Component>
  );
}

// ============================================
// CARD SECTIONS
// ============================================

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  withDivider?: boolean;
}

export function CardHeader({ children, className, withDivider = false }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', withDivider && 'pb-4 border-b border-dark-200 dark:border-dark-600', className)}>
      {children}
    </div>
  );
}

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
  return <div className={cn('', className)}>{children}</div>;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  withDivider?: boolean;
  align?: 'left' | 'center' | 'right';
}

export function CardFooter({ children, className, withDivider = false, align = 'left' }: CardFooterProps) {
  const alignMap = { left: 'flex justify-start', center: 'flex justify-center', right: 'flex justify-end' };
  
  return (
    <div className={cn(
      'mt-4 pt-4',
      withDivider && 'border-t border-dark-200 dark:border-dark-600',
      alignMap[align],
      className
    )}>
      {children}
    </div>
  );
}

// ============================================
// DEFAULT EXPORT
// ============================================

export default Card;
