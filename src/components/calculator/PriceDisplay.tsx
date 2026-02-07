/**
 * PriceDisplay - Компонент отображения стоимости
 * 
 * Показывает детализацию стоимости и кнопки действий:
 * - Сохранение расчёта
 * - Генерация коммерческого предложения (PDF)
 */

import { motion } from 'framer-motion';
import { formatPrice } from '../../utils/calculator/pricing';
import type { PriceBreakdown } from '../../utils/calculator/types';
import { GLAZING_OPTIONS, HARDWARE_OPTIONS, PROFILES } from '../../utils/calculator/types';

interface PriceDisplayProps {
  breakdown: PriceBreakdown | null;
  onSave: () => void;
  onGenerateOffer: () => void;
}

export function PriceDisplay({ breakdown, onSave, onGenerateOffer }: PriceDisplayProps) {
  if (!breakdown) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <p className="text-center text-gray-500 dark:text-gray-400">
          Заполните параметры для расчёта стоимости
        </p>
      </div>
    );
  }

  const profile = PROFILES.find(p => p.pricePerSqm === breakdown.profilePrice);
  const glazing = GLAZING_OPTIONS.find(g => g.pricePerSqm === breakdown.glazingPrice);
  const hardware = HARDWARE_OPTIONS.find(h => h.pricePerSash * breakdown.sashCount === breakdown.hardwareCost);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Стоимость
      </h2>

      {/* Детализация */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400">Профиль</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {profile?.name || 'Стандарт'}
          </span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400">Стеклопакет</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {glazing?.name || 'Стандарт'}
          </span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400">Фурнитура</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {hardware?.name || 'Стандарт'}
          </span>
        </div>

        {breakdown.extrasCost > 0 && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Доп. опции</span>
            <span className="font-medium text-gray-900 dark:text-white">
              +{formatPrice(breakdown.extrasCost)}
            </span>
          </div>
        )}

        {breakdown.installationCost > 0 && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Монтаж (15%)</span>
            <span className="font-medium text-gray-900 dark:text-white">
              +{formatPrice(breakdown.installationCost)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400">Отходы (10%)</span>
          <span className="font-medium text-gray-900 dark:text-white">
            +{formatPrice(breakdown.wasteFactor)}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 pt-4">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Итого
          </span>
          <motion.span
            key={breakdown.totalPrice}
            initial={{ scale: 1.1, color: '#2563eb' }}
            animate={{ scale: 1, color: '#111827' }}
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            {formatPrice(breakdown.totalPrice)}
          </motion.span>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSave}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Сохранить расчёт
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onGenerateOffer}
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Скачать КП в PDF
        </motion.button>
      </div>

      {/* Гарантия */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
        * Цена ориентировочная. Точная стоимость определяется замерщиком.
        <br />Гарантия на монтажные работы — 5 лет.
      </p>
    </div>
  );
}

export default PriceDisplay;
