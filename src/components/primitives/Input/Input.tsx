/**
 * Input Component
 * 
 * A versatile input component with validation states, accessibility features,
 * and support for various input types.
 * 
 * @packageDocumentation
 */

import { AlertCircle, CheckCircle2 } from 'lucide-react';
import React, { forwardRef, useId } from 'react';

// ============================================
// TYPES
// ============================================

/** Input HTML types */
export type InputType = 
  | 'text' 
  | 'email' 
  | 'tel' 
  | 'number' 
  | 'password' 
  | 'search' 
  | 'url'
  | 'date'
  | 'time';

/** Input size variants */
export type InputSize = 'sm' | 'md' | 'lg';

/** Validation status */
export type InputStatus = 'default' | 'success' | 'error' | 'warning';

/** Interface for Input props */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label for the input */
  label?: string;
  /** Helper text displayed below input */
  helperText?: string;
  /** Error message (when status is 'error') */
  errorMessage?: string;
  /** Left icon component */
  leftIcon?: React.ReactNode;
  /** Right icon component */
  rightIcon?: React.ReactNode;
  /** Input size */
  size?: InputSize;
  /** Validation status */
  status?: InputStatus;
  /** Whether the input takes full width */
  fullWidth?: boolean;
  /** Whether the input is required */
  required?: boolean;
  /** Custom container className */
  containerClassName?: string;
}

// ============================================
// CONSTANTS
// ============================================

/** Size configurations - using Tailwind utilities */
const SIZE_CLASSES: Record<InputSize, { height: string; text: string; px: string; icon: string }> = {
  sm: { height: 'h-10', text: 'text-sm', px: 'px-3', icon: 'w-4 h-4' },
  md: { height: 'h-12', text: 'text-base', px: 'px-4', icon: 'w-5 h-5' },
  lg: { height: 'h-14', text: 'text-lg', px: 'px-5', icon: 'w-6 h-6' },
};

/** Status styles */
const STATUS_CLASSES: Record<InputStatus, { border: string; ring: string; text: string }> = {
  default: {
    border: 'border-dark-300',
    ring: 'focus:border-primary-500 focus:ring-primary-500',
    text: 'text-dark-500',
  },
  success: {
    border: 'border-success-500',
    ring: 'focus:border-success-500 focus:ring-success-500',
    text: 'text-success-600',
  },
  error: {
    border: 'border-error-500',
    ring: 'focus:border-error-500 focus:ring-error-500',
    text: 'text-error-600',
  },
  warning: {
    border: 'border-warning-500',
    ring: 'focus:border-warning-500 focus:ring-warning-500',
    text: 'text-warning-600',
  },
};

// ============================================
// HELPER FUNCTION
// ============================================

/**
 * Formats phone number as user types
 */
export function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})$/);
  
  if (match) {
    const parts: string[] = [];
    if (match[1]) parts.push(`(${match[1]}`);
    if (match[2]) parts.push(`) ${match[2]}`);
    if (match[3]) parts.push(`-${match[3]}`);
    if (match[4]) parts.push(`-${match[4]}`);
    return parts.join('');
  }
  
  return value;
}

/**
 * Combines class names conditionally
 */
function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ============================================
// COMPONENT
// ============================================

/**
 * Input component with validation and icons support
 * 
 * @example
 * ```tsx
 * <Input 
 *   label="Email" 
 *   type="email" 
 *   placeholder="Enter your email"
 *   status="error"
 *   errorMessage="Invalid email format"
 * />
 * <Input 
 *   leftIcon={<MailIcon />}
 *   label="Phone"
 *   type="tel"
 *   value={value}
 *   onChange={handleChange}
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      leftIcon,
      rightIcon,
      size = 'md',
      status = 'default',
      fullWidth = true,
      required,
      disabled,
      containerClassName,
      className,
      id: providedId,
      type = 'text',
      ...props
    },
    ref
  ) => {
    // Generate unique ID for accessibility
    const generatedId = useId();
    const id = providedId || generatedId;
    const helperTextId = `${id}-helper`;
    const errorTextId = `${id}-error`;

    const sizeClasses = SIZE_CLASSES[size];
    const statusClasses = STATUS_CLASSES[status];

    // Determine aria-describedby
    const describedBy = (helperText && !errorMessage) 
      ? helperTextId 
      : errorMessage 
        ? errorTextId 
        : undefined;

    // Status icon
    const statusIcon = status === 'success' ? (
      <CheckCircle2 className={sizeClasses.icon} aria-hidden="true" />
    ) : status === 'error' ? (
      <AlertCircle className={sizeClasses.icon} aria-hidden="true" />
    ) : null;

    // Calculate icon padding
    const paddingLeft = leftIcon ? `pl-10` : '';
    const paddingRight = (rightIcon || statusIcon) ? `pr-10` : '';

    return (
      <div className={cn(fullWidth && 'w-full', containerClassName)}>
        {/* Label */}
        {label && (
          <label 
            htmlFor={id} 
            className="block text-sm font-medium text-dark-700 mb-1.5"
          >
            {label}
            {required && (
              <span className="text-error-500 ml-0.5" aria-hidden="true">*</span>
            )}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div 
              className={cn(
                'absolute left-0 top-0 bottom-0 flex items-center pl-3 pointer-events-none',
                statusClasses.text
              )}
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}

          {/* Input element */}
          <input
            ref={ref}
            id={id}
            type={type}
            disabled={disabled}
            required={required}
            aria-invalid={status === 'error'}
            aria-describedby={describedBy}
            aria-required={required}
            className={cn(
              // Base styles
              'w-full',
              'bg-white',
              'text-dark-900',
              'placeholder:text-dark-400',
              'rounded-lg',
              'border',
              'transition-all',
              'duration-200',
              'ease-out',
              
              // Size styles
              sizeClasses.height,
              sizeClasses.text,
              sizeClasses.px,
              
              // Status styles
              statusClasses.border,
              statusClasses.ring,
              
              // Focus styles
              'focus:outline-none',
              'focus:ring-2',
              'focus:ring-opacity-20',
              
              // Disabled
              'disabled:opacity-50',
              'disabled:pointer-events-none',
              'disabled:bg-dark-100',
              
              // Icon padding
              paddingLeft,
              paddingRight,
              
              // Custom className
              className
            )}
            {...props}
          />

          {/* Right icon / status icon */}
          {(rightIcon || statusIcon) && (
            <div 
              className={cn(
                'absolute right-0 top-0 bottom-0 flex items-center pr-3 pointer-events-none',
                status === 'error' || status === 'success' ? statusClasses.text : 'text-dark-400'
              )}
              aria-hidden="true"
            >
              {statusIcon || rightIcon}
            </div>
          )}
        </div>

        {/* Helper / Error text */}
        {(helperText || errorMessage) && (
          <p
            id={errorMessage ? errorTextId : helperTextId}
            className={cn(
              'mt-1.5',
              'text-sm',
              errorMessage ? statusClasses.text : 'text-dark-500'
            )}
            aria-live={status === 'error' ? 'polite' : undefined}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

// Display name for React DevTools
Input.displayName = 'Input';

// ============================================
// TEXTAREA COMPONENT
// ============================================

/** Interface for Textarea props */
export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** Label for the textarea */
  label?: string;
  /** Helper text displayed below textarea */
  helperText?: string;
  /** Error message (when status is 'error') */
  errorMessage?: string;
  /** Validation status */
  status?: InputStatus;
  /** Whether the textarea takes full width */
  fullWidth?: boolean;
  /** Whether the textarea is required */
  required?: boolean;
  /** Custom container className */
  containerClassName?: string;
}

/**
 * Textarea component for multi-line input
 * 
 * @example
 * ```tsx
 * <Textarea 
 *   label="Message" 
 *   placeholder="Enter your message"
 *   rows={4}
 *   required
 * />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      status = 'default',
      fullWidth = true,
      required,
      disabled,
      containerClassName,
      className,
      id: providedId,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const helperTextId = `${id}-helper`;
    const errorTextId = `${id}-error`;

    const statusClasses = STATUS_CLASSES[status];
    const describedBy = (helperText && !errorMessage) 
      ? helperTextId 
      : errorMessage 
        ? errorTextId 
        : undefined;

    return (
      <div className={cn(fullWidth && 'w-full', containerClassName)}>
        {/* Label */}
        {label && (
          <label 
            htmlFor={id} 
            className="block text-sm font-medium text-dark-700 mb-1.5"
          >
            {label}
            {required && (
              <span className="text-error-500 ml-0.5" aria-hidden="true">*</span>
            )}
          </label>
        )}

        {/* Textarea element */}
        <textarea
          ref={ref}
          id={id}
          disabled={disabled}
          required={required}
          aria-invalid={status === 'error'}
          aria-describedby={describedBy}
          aria-required={required}
          rows={rows}
          className={cn(
            // Base styles
            'w-full',
            'bg-white',
            'text-dark-900',
            'placeholder:text-dark-400',
            'rounded-lg',
            'border',
            'px-4',
            'py-3',
            'text-base',
            'transition-all',
            'duration-200',
            'ease-out',
            'resize-y',
            'min-h-[100px]',
            
            // Status styles
            statusClasses.border,
            statusClasses.ring,
            
            // Focus styles
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-opacity-20',
            
            // Disabled
            'disabled:opacity-50',
            'disabled:pointer-events-none',
            'disabled:bg-dark-100',
            
            // Custom className
            className
          )}
          {...props}
        />

        {/* Helper / Error text */}
        {(helperText || errorMessage) && (
          <p
            id={errorMessage ? errorTextId : helperTextId}
            className={cn(
              'mt-1.5',
              'text-sm',
              errorMessage ? statusClasses.text : 'text-dark-500'
            )}
            aria-live={status === 'error' ? 'polite' : undefined}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// ============================================
// SELECT COMPONENT
// ============================================

/** Option interface for Select component */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** Interface for Select props */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Label for the select */
  label?: string;
  /** Helper text displayed below select */
  helperText?: string;
  /** Error message (when status is 'error') */
  errorMessage?: string;
  /** Select size */
  size?: InputSize;
  /** Validation status */
  status?: InputStatus;
  /** Whether the select takes full width */
  fullWidth?: boolean;
  /** Whether the select is required */
  required?: boolean;
  /** Custom container className */
  containerClassName?: string;
  /** Options for the select */
  options: SelectOption[];
  /** Placeholder option */
  placeholder?: string;
}

/**
 * Select component for dropdown selection
 * 
 * @example
 * ```tsx
 * <Select
 *   label="Service"
 *   options={[
 *     { value: 'installation', label: 'Installation' },
 *     { value: 'repair', label: 'Repair' },
 *   ]}
 *   placeholder="Select a service"
 *   required
 * />
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      size = 'md',
      status = 'default',
      fullWidth = true,
      required,
      disabled,
      containerClassName,
      className,
      id: providedId,
      options,
      placeholder,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const helperTextId = `${id}-helper`;
    const errorTextId = `${id}-error`;

    const sizeClasses = SIZE_CLASSES[size];
    const statusClasses = STATUS_CLASSES[status];
    const describedBy = (helperText && !errorMessage) 
      ? helperTextId 
      : errorMessage 
        ? errorTextId 
        : undefined;

    return (
      <div className={cn(fullWidth && 'w-full', containerClassName)}>
        {/* Label */}
        {label && (
          <label 
            htmlFor={id} 
            className="block text-sm font-medium text-dark-700 mb-1.5"
          >
            {label}
            {required && (
              <span className="text-error-500 ml-0.5" aria-hidden="true">*</span>
            )}
          </label>
        )}

        {/* Select element */}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            required={required}
            aria-invalid={status === 'error'}
            aria-describedby={describedBy}
            aria-required={required}
            className={cn(
              // Base styles
              'w-full',
              'bg-white',
              'text-dark-900',
              'rounded-lg',
              'border',
              'transition-all',
              'duration-200',
              'ease-out',
              'appearance-none',
              'cursor-pointer',
              
              // Size styles
              sizeClasses.height,
              sizeClasses.text,
              sizeClasses.px,
              
              // Status styles
              statusClasses.border,
              statusClasses.ring,
              
              // Focus styles
              'focus:outline-none',
              'focus:ring-2',
              'focus:ring-opacity-20',
              
              // Disabled
              'disabled:opacity-50',
              'disabled:pointer-events-none',
              'disabled:bg-dark-100',
              
              // Custom className
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Chevron icon */}
          <div 
            className="absolute right-0 top-0 bottom-0 flex items-center pr-3 pointer-events-none text-dark-400"
            aria-hidden="true"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* Helper / Error text */}
        {(helperText || errorMessage) && (
          <p
            id={errorMessage ? errorTextId : helperTextId}
            className={cn(
              'mt-1.5',
              'text-sm',
              errorMessage ? statusClasses.text : 'text-dark-500'
            )}
            aria-live={status === 'error' ? 'polite' : undefined}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// ============================================
// DEFAULT EXPORT
// ============================================

export default Input;
