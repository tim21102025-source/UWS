/**
 * ConfigPanel - Панель конфигурации окна
 * 
 * Содержит все элементы управления для настройки параметров окна:
 * - Тип конструкции
 * - Размеры (ширина/высота)
 * - Профильная система
 * - Стеклопакет
 * - Фурнитура
 * - Дополнительные опции
 * - Опция монтажа
 */

import { motion } from 'framer-motion';
import type { CalculatorConfig } from '../../utils/calculator/types';
import { EXTRA_OPTIONS, GLAZING_OPTIONS, HARDWARE_OPTIONS, PROFILES } from '../../utils/calculator/types';

interface ConfigPanelProps {
  config: CalculatorConfig;
  onWindowTypeChange: (type: CalculatorConfig['windowType']) => void;
  onDimensionsChange: (width: number, height: number) => void;
  onProfileChange: (profileId: string) => void;
  onGlazingChange: (glazingId: string) => void;
  onHardwareChange: (hardwareId: string) => void;
  onExtraToggle: (extraId: string) => void;
  onInstallationChange: (include: boolean) => void;
  onReset: () => void;
}

export function ConfigPanel({
  config,
  onWindowTypeChange,
  onDimensionsChange,
  onProfileChange,
  onGlazingChange,
  onHardwareChange,
  onExtraToggle,
  onInstallationChange,
  onReset,
}: ConfigPanelProps) {
  const windowTypes: Array<{ id: CalculatorConfig['windowType']; label: string; icon: string }> = [
    { id: 'single', label: 'Одностворчатое', icon: '◧' },
    { id: 'double', label: 'Двустворчатое', icon: '⧉' },
    { id: 'triple', label: 'Трёхстворчатое', icon: '⬡' },
    { id: 'balcony', label: 'Балконный блок', icon: '🚪' },
    { id: 'door', label: 'Входная дверь', icon: '🚪' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
      {/* Заголовок панели */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Конфигурация
        </h2>
        <button
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          Сбросить
        </button>
      </div>

      {/* Тип конструкции */}
      <section>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Тип конструкции
        </label>
        <div className="grid grid-cols-3 gap-3">
          {windowTypes.map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onWindowTypeChange(type.id)}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                config.windowType === type.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <span className="text-2xl mb-1 block">{type.icon}</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {type.label}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Размеры */}
      <section>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Размеры (см)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              Ширина
            </label>
            <input
              type="number"
              min="30"
              max="300"
              value={config.width}
              onChange={(e) => onDimensionsChange(Number(e.target.value), config.height)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              Высота
            </label>
            <input
              type="number"
              min="30"
              max="300"
              value={config.height}
              onChange={(e) => onDimensionsChange(config.width, Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Площадь: {(config.width * config.height / 10000).toFixed(2)} м²
        </p>
      </section>

      {/* Профильная система */}
      <section>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Профильная система
        </label>
        <div className="space-y-2">
          {PROFILES.map((profile) => (
            <motion.button
              key={profile.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onProfileChange(profile.id)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                config.profileId === profile.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {profile.name}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {profile.cameras} камеры • {profile.width}мм
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {profile.pricePerSqm} грн/м²
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Стеклопакет */}
      <section>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Стеклопакет
        </label>
        <div className="space-y-2">
          {GLAZING_OPTIONS.map((glazing) => (
            <motion.button
              key={glazing.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onGlazingChange(glazing.id)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                config.glazingId === glazing.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {glazing.name}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {glazing.thickness}мм • {glazing.description}
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {glazing.pricePerSqm} грн/м²
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Фурнитура */}
      <section>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Фурнитура
        </label>
        <div className="space-y-2">
          {HARDWARE_OPTIONS.map((hardware) => (
            <motion.button
              key={hardware.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onHardwareChange(hardware.id)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                config.hardwareId === hardware.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {hardware.name}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {hardware.brand} • {hardware.class}
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {hardware.pricePerSash} грн/створка
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Дополнительные опции */}
      <section>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Дополнительные опции
        </label>
        <div className="space-y-2">
          {EXTRA_OPTIONS.map((extra) => (
            <label
              key={extra.id}
              className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                config.extras.includes(extra.id)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <input
                type="checkbox"
                checked={config.extras.includes(extra.id)}
                onChange={() => onExtraToggle(extra.id)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="ml-3 flex-1">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {extra.name}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {extra.description}
                </p>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                +{extra.price} грн
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Монтаж */}
      <section>
        <label className="flex items-center p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-all">
          <input
            type="checkbox"
            checked={config.includeInstallation}
            onChange={(e) => onInstallationChange(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <div className="ml-3">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Включить монтаж (+15%)
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Профессиональная установка с гарантией
            </p>
          </div>
        </label>
      </section>
    </div>
  );
}

export default ConfigPanel;
