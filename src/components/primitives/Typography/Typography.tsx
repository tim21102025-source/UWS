/**
 * Typography Component
 * 
 * Typography components for headings and text with consistent styling.
 * 
 * @packageDocumentation
 */

import React from 'react';

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ============================================
// HEADING
// ============================================

export interface HeadingProps {
  children: React.ReactNode;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'white' | 'dark' | 'muted';
  align?: 'left' | 'center' | 'right';
  className?: string;
}

const headingSizes: Record<string, string> = {
  xs: 'text-xs', sm: 'text-sm', md: 'text-base', lg: 'text-lg',
  xl: 'text-xl', '2xl': 'text-2xl', '3xl': 'text-3xl',
  '4xl': 'text-4xl', '5xl': 'text-5xl', '6xl': 'text-6xl',
};

const headingColors: Record<string, string> = {
  primary: 'text-primary-500', secondary: 'text-dark-500',
  white: 'text-white', dark: 'text-dark-900', muted: 'text-dark-400',
};

const headingDefaults: Record<string, { size: string; weight: string }> = {
  h1: { size: 'text-4xl md:text-5xl', weight: 'font-bold' },
  h2: { size: 'text-3xl md:text-4xl', weight: 'font-bold' },
  h3: { size: 'text-2xl md:text-3xl', weight: 'font-semibold' },
  h4: { size: 'text-xl md:text-2xl', weight: 'font-semibold' },
  h5: { size: 'text-lg md:text-xl', weight: 'font-medium' },
  h6: { size: 'text-base md:text-lg', weight: 'font-medium' },
};

const alignClasses: Record<string, string> = {
  left: 'text-left', center: 'text-center', right: 'text-right',
};

export function Heading({
  children, level = 'h2', size, weight, color = 'dark', align = 'left', className,
}: HeadingProps) {
  const defaultStyles = headingDefaults[level] || headingDefaults.h2;
  const currentSize = size ? headingSizes[size] : defaultStyles.size;
  const currentWeight = weight || defaultStyles.weight;
  const currentColor = headingColors[color] || headingColors.dark;
  const currentAlign = alignClasses[align] || alignClasses.left;

  const Component = level;
  return (
    <Component className={cn('font-heading', 'leading-tight', 'tracking-tight', currentSize, currentWeight, currentColor, currentAlign, className)}>
      {children}
    </Component>
  );
}

// ============================================
// TEXT
// ============================================

export interface TextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'white' | 'dark' | 'muted' | 'success' | 'error' | 'warning';
  align?: 'left' | 'center' | 'right' | 'justify';
  className?: string;
  as?: 'p' | 'span' | 'div' | 'small';
}

const textSizes: Record<string, string> = {
  xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl',
};

const textColors: Record<string, string> = {
  primary: 'text-primary-500', secondary: 'text-dark-500', white: 'text-white',
  dark: 'text-dark-900', muted: 'text-dark-400', success: 'text-success-600',
  error: 'text-error-600', warning: 'text-warning-600',
};

const textAlignClasses: Record<string, string> = {
  left: 'text-left', center: 'text-center', right: 'text-right', justify: 'text-justify',
};

export function Text({
  children, size = 'base', weight = 'normal', color = 'dark', align = 'left', className, as = 'p',
}: TextProps) {
  const Component = as;
  return (
    <Component className={cn('font-sans', 'leading-relaxed', textSizes[size], {
      'font-normal': weight === 'normal',
      'font-medium': weight === 'medium',
      'font-semibold': weight === 'semibold',
      'font-bold': weight === 'bold',
    }[weight || 'normal'], textColors[color] || textColors.dark, textAlignClasses[align] || textAlignClasses.left, className)}>
      {children}
    </Component>
  );
}

// ============================================
// PARAGRAPH
// ============================================

export interface ParagraphProps {
  children: React.ReactNode;
  size?: 'sm' | 'base' | 'lg';
  color?: 'primary' | 'secondary' | 'dark' | 'muted';
  className?: string;
}

export function Paragraph({ children, size = 'base', color = 'dark', className }: ParagraphProps) {
  const sizeMap = { sm: 'text-sm', base: 'text-base', lg: 'text-lg' };
  const colorMap = { primary: 'text-primary-600', secondary: 'text-dark-500', dark: 'text-dark-800', muted: 'text-dark-400' };
  return <p className={cn('mb-4', 'leading-relaxed', sizeMap[size], colorMap[color], className)}>{children}</p>;
}

// ============================================
// CAPTION
// ============================================

export interface CaptionProps {
  children: React.ReactNode;
  color?: 'secondary' | 'muted' | 'primary';
  className?: string;
}

export function Caption({ children, color = 'muted', className }: CaptionProps) {
  const colorMap = { secondary: 'text-dark-500', muted: 'text-dark-400', primary: 'text-primary-500' };
  return <span className={cn('text-xs', 'uppercase', 'tracking-wider', 'font-medium', colorMap[color], className)}>{children}</span>;
}

// ============================================
// LABEL
// ============================================

export interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export function Label({ children, required = false, className }: LabelProps) {
  return <label className={cn('block', 'text-sm', 'font-medium', 'text-dark-700', 'mb-1.5', className)}>{children}{required && <span className="text-error-500 ml-0.5">*</span>}</label>;
}

export default Heading;
