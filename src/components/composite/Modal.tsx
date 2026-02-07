/**
 * Modal Component
 * 
 * Accessible modal dialog with animations and focus management.
 * 
 * @packageDocumentation
 */

import { X } from 'lucide-react';
import React, { useCallback, useEffect, useRef } from 'react';

// ============================================
// TYPES
// ============================================

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Show close button */
  showClose?: boolean;
  /** Close on backdrop click */
  closeOnBackdrop?: boolean;
  /** Close on escape key */
  closeOnEscape?: boolean;
  /** Remove default padding */
  noPadding?: boolean;
  /** Custom className */
  className?: string;
}

// ============================================
// HELPER
// ============================================

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * Modal - Accessible dialog component with animations
 * 
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Заказать звонок"
 *   size="md"
 * >
 *   <OrderForm />
 * </Modal>
 * ```
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  noPadding = false,
  className,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  };

  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && closeOnEscape) {
      onClose();
    }
  }, [closeOnEscape, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();

      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm animate-fade-in"
        onClick={handleBackdropClick}
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          'relative w-full mx-4 bg-white rounded-2xl shadow-2xl',
          'animate-slide-up',
          'focus:outline-none',
          sizeClasses[size],
          noPadding && 'p-0',
          !noPadding && 'p-6',
          className
        )}
      >
        {/* Close Button */}
        {showClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-dark-400 hover:text-dark-600 hover:bg-dark-100 transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Title */}
        {title && (
          <h2
            id="modal-title"
            className="text-xl font-semibold text-dark-900 mb-4 pr-10"
          >
            {title}
          </h2>
        )}

        {/* Children */}
        <div className={cn(!noPadding && 'mt-4')}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================
// DEFAULT EXPORT
// ============================================

export default Modal;
