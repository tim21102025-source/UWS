/**
 * OfferGenerator - Генератор коммерческого предложения PDF
 * 
 * Создаёт PDF документ с коммерческим предложением
 * с использованием библиотеки jspdf.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import { useState } from 'react';
import { formatPrice } from '../../utils/calculator/pricing';
import type { CalculatorConfig, PriceBreakdown } from '../../utils/calculator/types';
import { EXTRA_OPTIONS, GLAZING_OPTIONS, HARDWARE_OPTIONS, PROFILES, WINDOW_TYPE_LABELS } from '../../utils/calculator/types';

interface OfferGeneratorProps {
  config: CalculatorConfig;
  breakdown: PriceBreakdown;
  onClose: () => void;
}

export function OfferGenerator({ config, breakdown, onClose }: OfferGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const profile = PROFILES.find(p => p.id === config.profileId);
  const glazing = GLAZING_OPTIONS.find(g => g.id === config.glazingId);
  const hardware = HARDWARE_OPTIONS.find(h => h.id === config.hardwareId);
  const selectedExtras = EXTRA_OPTIONS.filter(e => config.extras.includes(e.id));

  const handleGeneratePDF = async () => {
    if (!formData.name || !formData.phone) {
      alert('Пожалуйста, заполните обязательные поля: Имя и Телефон');
      return;
    }

    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      // Заголовок
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ', pageWidth / 2, y, { align: 'center' });
      y += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, pageWidth / 2, y, { align: 'center' });
      y += 15;

      // Информация о клиенте
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Информация о клиенте', 20, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Имя: ${formData.name}`, 20, y);
      y += 6;
      doc.text(`Телефон: ${formData.phone}`, 20, y);
      y += 6;
      if (formData.email) {
        doc.text(`Email: ${formData.email}`, 20, y);
        y += 6;
      }
      if (formData.address) {
        doc.text(`Адрес: ${formData.address}`, 20, y);
        y += 6;
      }
      y += 10;

      // Конфигурация
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Конфигурация окна', 20, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Тип конструкции: ${WINDOW_TYPE_LABELS[config.windowType]}`, 20, y);
      y += 6;
      doc.text(`Размеры: ${config.width} × ${config.height} см (${breakdown.area.toFixed(2)} м²)`, 20, y);
      y += 15;

      // Профиль
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Профильная система', 20, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Профиль: ${profile?.name}`, 20, y);
      y += 5;
      doc.text(`Количество камер: ${profile?.cameras}`, 20, y);
      y += 5;
      doc.text(`Ширина профиля: ${profile?.width} мм`, 20, y);
      y += 5;
      doc.text(`Цена за м²: ${formatPrice(profile?.pricePerSqm || 0)}`, 20, y);
      y += 15;

      // Стеклопакет
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Стеклопакет', 20, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Тип: ${glazing?.name}`, 20, y);
      y += 5;
      doc.text(`Толщина: ${glazing?.thickness} мм`, 20, y);
      y += 5;
      doc.text(`Цена за м²: ${formatPrice(glazing?.pricePerSqm || 0)}`, 20, y);
      y += 15;

      // Фурнитура
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Фурнитура', 20, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Бренд: ${hardware?.name}`, 20, y);
      y += 5;
      doc.text(`Класс: ${hardware?.class}`, 20, y);
      y += 5;
      doc.text(`Количество створок: ${breakdown.sashCount}`, 20, y);
      y += 5;
      doc.text(`Стоимость фурнитуры: ${formatPrice(breakdown.hardwareCost)}`, 20, y);
      y += 15;

      // Дополнительные опции
      if (selectedExtras.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Дополнительные опции', 20, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        selectedExtras.forEach((extra) => {
          doc.text(`• ${extra.name}: ${formatPrice(extra.price)}`, 20, y);
          y += 5;
        });
        y += 10;
      }

      // Стоимость
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Стоимость', 20, y);
      y += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Стоимость материалов: ${formatPrice(breakdown.basePrice)}`, 20, y);
      y += 5;
      doc.text(`Фурнитура: ${formatPrice(breakdown.hardwareCost)}`, 20, y);
      y += 5;
      
      if (breakdown.extrasCost > 0) {
        doc.text(`Дополнительные опции: ${formatPrice(breakdown.extrasCost)}`, 20, y);
        y += 5;
      }
      
      if (breakdown.installationCost > 0) {
        doc.text(`Монтаж (15%): ${formatPrice(breakdown.installationCost)}`, 20, y);
        y += 5;
      }
      
      doc.text(`Отходы (10%): ${formatPrice(breakdown.wasteFactor)}`, 20, y);
      y += 10;

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`ИТОГО: ${formatPrice(breakdown.totalPrice)}`, 20, y);
      y += 20;

      // Контактная информация
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('Контактная информация:', 20, y);
      y += 6;
      doc.text('UWS - Ukrainian Window Systems', 20, y);
      y += 5;
      doc.text('Телефон: +38 (044) 123-45-67', 20, y);
      y += 5;
      doc.text('Email: info@uws.com.ua', 20, y);
      y += 5;
      doc.text('Сайт: uws.com.ua', 20, y);

      // Сохранение PDF
      doc.save(`KP_UWS_${Date.now()}.pdf`);

      onClose();
    } catch (error) {
      console.error('Ошибка генерации PDF:', error);
      alert('Произошла ошибка при генерации PDF. Попробуйте ещё раз.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Коммерческое предложение
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Контент */}
          <div className="p-6 space-y-4">
            {/* Итоговая цена */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Стоимость</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(breakdown.totalPrice)}
              </p>
            </div>

            {/* Конфигурация */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2 text-sm">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Ваша конфигурация</h3>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Тип:</span> {WINDOW_TYPE_LABELS[config.windowType]}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Размеры:</span> {config.width} × {config.height} см
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Профиль:</span> {profile?.name}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Стекло:</span> {glazing?.name}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Фурнитура:</span> {hardware?.name}
              </p>
              {selectedExtras.length > 0 && (
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Опции:</span> {selectedExtras.map(e => e.name).join(', ')}
                </p>
              )}
            </div>

            {/* Форма данных клиента */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Контактные данные
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Имя <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ваше имя"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Телефон <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="+38 (___) ___-__-__"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Адрес объекта
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="г. Киев, ул. Примерная, д. 1"
                />
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Отмена
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Генерация...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Скачать PDF
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default OfferGenerator;
