import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';
import React, { useState } from 'react';
import { analyticsEvents } from '../../utils/analytics';
import { OrderModal } from './OrderModal';

interface OrderButtonProps {
  variant?: 'primary' | 'secondary' | 'icon';
  service?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function OrderButton({
  variant = 'primary',
  service = '',
  children,
  className = '',
  onClick,
}: OrderButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    analyticsEvents.ctaClick(
      variant === 'primary' ? 'Заказать звонок' : 'Оставить заявку',
      service
    );
    onClick?.();
    setIsModalOpen(true);
  };

  if (variant === 'icon') {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className={`p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors ${className}`}
          aria-label="Заказать звонок"
        >
          <Phone className="w-6 h-6" />
        </motion.button>

        <OrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          service={service}
        />
      </>
    );
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className={`
          inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg transition-colors
          ${
            variant === 'primary'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
          }
          ${className}
        `}
      >
        {variant === 'primary' ? (
          <Phone className="w-5 h-5" />
        ) : (
          <MessageCircle className="w-5 h-5" />
        )}
        {children || 'Заказать звонок'}
      </motion.button>

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={service}
      />
    </>
  );
}
