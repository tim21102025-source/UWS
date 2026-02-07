/**
 * WindowCalculator - Главный компонент калькулятора окон UWS
 * 
 * Создаёт полноценный калькулятор стоимости окон с:
 * - Визуальным 2D превью
 * - Выбором типа конструкции, размеров, профиля, стеклопакета, фурнитуры
 * - Дополнительными опциями
 * - Расчётом монтажа
 * - Генерацией PDF коммерческого предложения
 * - Историей расчётов (localStorage)
 * 
 * Согласно docs/01-requirements_specification.md
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { formatPrice } from '../../utils/calculator/pricing';
import { useCalculatorStore } from '../../utils/calculator/store';
import type { WindowType } from '../../utils/calculator/types';
import { GLAZING_OPTIONS, PROFILES, WINDOW_TYPE_LABELS } from '../../utils/calculator/types';

import { ConfigPanel } from './ConfigPanel';
import { OfferGenerator } from './OfferGenerator';
import { PreviewPanel } from './PreviewPanel';
import { PriceDisplay } from './PriceDisplay';

export function WindowCalculator() {
  const { 
    config, 
    breakdown, 
    setWindowType, 
    setDimensions, 
    setProfile, 
    setGlazing,
    setHardware,
    toggleExtra,
    setIncludeInstallation,
    resetConfig,
    saveCalculation,
    history
  } = useCalculatorStore();

  const [showOfferGenerator, setShowOfferGenerator] = useState(false);
  const [activeTab, setActiveTab] = useState<'calculator' | 'history'>('calculator');

  // Инициализация при загрузке
  useEffect(() => {
    useCalculatorStore.getState().calculate();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-8">
      {/* Заголовок */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Калькулятор стоимости окон
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Рассчитайте стоимость остекления онлайн за 2 минуты
        </p>
      </motion.div>

      {/* Вкладки */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'calculator'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Калькулятор
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            История ({history.length})
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'calculator' ? (
          <motion.div
            key="calculator"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Левая панель - Конфигурация */}
            <ConfigPanel
              config={config}
              onWindowTypeChange={setWindowType}
              onDimensionsChange={setDimensions}
              onProfileChange={setProfile}
              onGlazingChange={setGlazing}
              onHardwareChange={setHardware}
              onExtraToggle={toggleExtra}
              onInstallationChange={setIncludeInstallation}
              onReset={resetConfig}
            />

            {/* Правая панель - Превью и цена */}
            <div className="space-y-6">
              <PreviewPanel
                windowType={config.windowType}
                width={config.width}
                height={config.height}
              />
              
              <PriceDisplay
                breakdown={breakdown}
                onSave={saveCalculation}
                onGenerateOffer={() => setShowOfferGenerator(true)}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <HistoryPanel history={history} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модальное окно генерации КП */}
      <AnimatePresence>
        {showOfferGenerator && breakdown && (
          <OfferGenerator
            config={config}
            breakdown={breakdown}
            onClose={() => setShowOfferGenerator(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// История расчётов
function HistoryPanel({ 
  history 
}: { 
  history: Array<{
    id: string;
    date: string;
    config: ReturnType<typeof useCalculatorStore.getState>['config'];
    totalPrice: number;
  }>
}) {
  const { loadFromHistory, deleteFromHistory, clearAllHistory } = useCalculatorStore();

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          История пуста
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Здесь будут отображаться сохранённые расчёты
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          История расчётов
        </h2>
        <button
          onClick={clearAllHistory}
          className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          Очистить всё
        </button>
      </div>

      <div className="space-y-4">
        {history.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(item.date).toLocaleDateString('uk-UA', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                    {WINDOW_TYPE_LABELS[item.config.windowType as WindowType] || 'Окно'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>Размеры: {item.config.width} × {item.config.height} см</p>
                  <p>Профиль: {PROFILES.find(p => p.id === item.config.profileId)?.name || '-'}</p>
                  <p>Стекло: {GLAZING_OPTIONS.find(g => g.id === item.config.glazingId)?.name || '-'}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(item.totalPrice)}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => loadFromHistory(item.id)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Загрузить
                  </button>
                  <button
                    onClick={() => deleteFromHistory(item.id)}
                    className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default WindowCalculator;
