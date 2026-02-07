import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { OrderForm } from './OrderForm';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: string;
}

export function OrderModal({ isOpen, onClose, service = '' }: OrderModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="relative w-full max-w-lg"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute -top-12 right-0 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Content */}
              <OrderForm
                service={service}
                onSuccess={() => {
                  setTimeout(onClose, 3000);
                }}
              />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
