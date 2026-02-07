/**
 * PreviewPanel - Визуальное 2D превью окна
 * 
 * Отображает схематическое изображение окна на основе выбранной конфигурации.
 * Масштабируется в зависимости от размеров.
 */

import { motion } from 'framer-motion';
import type { WindowType } from '../../utils/calculator/types';

interface PreviewPanelProps {
  windowType: WindowType;
  width: number;
  height: number;
}

export function PreviewPanel({ windowType, width, height }: PreviewPanelProps) {
  // Нормализуем размеры для отображения (макс 200x200px)
  const maxSize = 200;
  const scale = Math.min(maxSize / width, maxSize / height);
  const displayWidth = width * scale;
  const displayHeight = height * scale;

  // Цвета профиля
  const frameColor = '#1e3a5f';
  const glassColor = '#87ceeb';
  const sashColor = '#2d5a87';

  // Количество створок
  const getSashCount = (): number => {
    switch (windowType) {
      case 'single': return 1;
      case 'double': return 2;
      case 'triple': return 3;
      case 'balcony': return 2;
      case 'door': return 1;
      default: return 1;
    }
  };

  const sashCount = getSashCount();

  // Рендер створок
  const renderSashes = () => {
    if (windowType === 'door') {
      return (
        <rect
          x="4"
          y="4"
          width={displayWidth - 8}
          height={displayHeight - 8}
          fill={sashColor}
          stroke={frameColor}
          strokeWidth="4"
          rx="2"
        />
      );
    }

    const gap = 4;
    const totalGap = gap * (sashCount - 1);
    const sashWidth = (displayWidth - 8 - totalGap) / sashCount;

    return Array.from({ length: sashCount }, (_, i) => (
      <motion.g
        key={i}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}
      >
        <rect
          x={4 + i * (sashWidth + gap)}
          y="4"
          width={sashWidth}
          height={displayHeight - 8}
          fill={sashColor}
          stroke={frameColor}
          strokeWidth="4"
          rx="2"
        />
        {/* Ручка */}
        <circle
          cx={4 + i * (sashWidth + gap) + sashWidth - 15}
          cy={(displayHeight - 8) / 2}
          r="6"
          fill={frameColor}
        />
      </motion.g>
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Визуальное превью
      </h2>
      
      <div className="flex justify-center items-center min-h-[300px] bg-gray-50 dark:bg-gray-900 rounded-lg">
        <svg
          width={displayWidth + 20}
          height={displayHeight + 20}
          viewBox={`0 0 ${displayWidth + 20} ${displayHeight + 20}`}
        >
          <motion.g
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Рама */}
            <rect
              x="2"
              y="2"
              width={displayWidth}
              height={displayHeight}
              fill="none"
              stroke={frameColor}
              strokeWidth="6"
              rx="4"
            />
            
            {/* Заполнение (стекло) */}
            <rect
              x="6"
              y="6"
              width={displayWidth - 12}
              height={displayHeight - 12}
              fill={glassColor}
              opacity="0.3"
              rx="2"
            />

            {/* Створки */}
            {renderSashes()}

            {/* Импост для многостворчатых */}
            {sashCount > 1 && windowType !== 'balcony' && windowType !== 'door' && (
              <line
                x1={displayWidth / 2 + 2}
                y1="4"
                x2={displayWidth / 2 + 2}
                y2={displayHeight - 4}
                stroke={frameColor}
                strokeWidth="4"
              />
            )}

            {/* Декоративные элементы для балконного блока */}
            {windowType === 'balcony' && (
              <g>
                {/* Окно верхняя часть */}
                <rect
                  x="4"
                  y="4"
                  width={displayWidth - 8}
                  height={displayHeight * 0.7 - 8}
                  fill={sashColor}
                  stroke={frameColor}
                  strokeWidth="4"
                  rx="2"
                />
                {/* Дверь нижняя часть */}
                <rect
                  x="4"
                  y={displayHeight * 0.7 + 2}
                  width={displayWidth - 8}
                  height={displayHeight * 0.3 - 6}
                  fill={sashColor}
                  stroke={frameColor}
                  strokeWidth="4"
                  rx="2"
                />
                {/* Ручка двери */}
                <circle
                  cx={displayWidth - 20}
                  cy={displayHeight * 0.7 + displayHeight * 0.15}
                  r="6"
                  fill={frameColor}
                />
              </g>
            )}
          </motion.g>
        </svg>
      </div>

      {/* Информация о размерах */}
      <div className="mt-4 flex justify-center gap-8 text-sm">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Ширина</p>
          <p className="font-semibold text-gray-900 dark:text-white">{width} см</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Высота</p>
          <p className="font-semibold text-gray-900 dark:text-white">{height} см</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Площадь</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {(width * height / 10000).toFixed(2)} м²
          </p>
        </div>
      </div>
    </div>
  );
}

export default PreviewPanel;
