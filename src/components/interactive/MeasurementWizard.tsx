/**
 * Measurement Wizard Component
 * 
 * Interactive step-by-step window measurement tool
 */

import React, { useState } from 'react';

interface MeasurementStep {
  id: string;
  title: string;
  description: string;
  tip?: string;
}

interface WindowMeasurement {
  width: number;
  height: number;
  type: 'single' | 'double' | 'triple' | 'balcony';
  opening: 'left' | 'right' | 'center' | 'none';
  hasSill: boolean;
  sillWidth?: number;
  notes?: string;
}

interface MeasurementWizardProps {
  steps?: MeasurementStep[];
  onComplete: (measurements: WindowMeasurement[]) => void;
  maxWindows?: number;
  currency?: string;
}

const DEFAULT_STEPS: MeasurementStep[] = [
  { id: 'intro', title: 'Замер окон', description: 'Измерьте окна самостоятельно', tip: 'Вам понадобится рулетка' },
  { id: 'width', title: 'Шаг 1: Ширина', description: 'Измерьте ширину проёма' },
  { id: 'height', title: 'Шаг 2: Высота', description: 'Измерьте высоту проёма' },
  { id: 'type', title: 'Шаг 3: Тип окна', description: 'Выберите тип конструкции' },
  { id: 'review', title: 'Проверка', description: 'Проверьте введённые данные' },
];

export const MeasurementWizard: React.FC<MeasurementWizardProps> = ({
  steps = DEFAULT_STEPS,
  onComplete,
  maxWindows = 5,
  currency = 'UAH',
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [windows, setWindows] = useState<WindowMeasurement[]>([]);
  const [currentWindow, setCurrentWindow] = useState<Partial<WindowMeasurement>>({});
  const [isExpanded, setIsExpanded] = useState(true);

  const step = steps[currentStep]!;
  const isLastStep = currentStep === steps.length - 1;

  const nextStep = () => !isLastStep && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  const handleTypeChange = (type: WindowMeasurement['type']) => {
    setCurrentWindow({ ...currentWindow, type });
  };

  const addWindow = () => {
    if (windows.length < maxWindows && currentWindow.width && currentWindow.height) {
      setWindows([...windows, currentWindow as WindowMeasurement]);
      setCurrentWindow({});
      setCurrentStep(0);
    }
  };

  const removeWindow = (index: number) => {
    setWindows(windows.filter((_, i) => i !== index));
  };

  const submitMeasurements = () => windows.length > 0 && onComplete(windows);

  const calculateArea = (w?: number, h?: number): number => (!w || !h) ? 0 : (w * h) / 10000;

  const formatCurrency = (value: number): string => 
    new Intl.NumberFormat('uk-UA', { style: 'currency', currency, minimumFractionDigits: 0 }).format(value);

  const estimatedPrice = (area: number): string => formatCurrency(area * 8500);

  const canProceed = (): boolean => {
    if (step.id === 'width') return Boolean(currentWindow.width && currentWindow.width > 0);
    if (step.id === 'height') return Boolean(currentWindow.height && currentWindow.height > 0);
    if (step.id === 'type') return Boolean(currentWindow.type);
    return true;
  };

  const renderStepContent = () => {
    switch (step.id) {
      case 'intro':
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-dark-900 mb-2">Самостоятельный замер окон</h3>
            <p className="text-dark-600 mb-6">Правильно измерьте окна и получите предварительный расчёт</p>
            {step.tip && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
                <p className="text-blue-700 text-sm">{step.tip}</p>
              </div>
            )}
          </div>
        );
      case 'width':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-dark-900">{step.description}</h3>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">Ширина проёма (см)</label>
              <input
                type="number" min="30" max="300"
                value={currentWindow.width || ''}
                onChange={(e) => setCurrentWindow({ ...currentWindow, width: Number(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-dark-200 rounded-xl focus:border-primary-500 focus:outline-none"
                placeholder="Например: 150"
              />
            </div>
          </div>
        );
      case 'height':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-dark-900">{step.description}</h3>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">Высота проёма (см)</label>
              <input
                type="number" min="30" max="300"
                value={currentWindow.height || ''}
                onChange={(e) => setCurrentWindow({ ...currentWindow, height: Number(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-dark-200 rounded-xl focus:border-primary-500 focus:outline-none"
                placeholder="Например: 150"
              />
            </div>
          </div>
        );
      case 'type':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-dark-900">{step.description}</h3>
            <div className="grid grid-cols-2 gap-3">
              {(['single', 'double', 'triple', 'balcony'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`p-4 rounded-xl border-2 transition-all ${currentWindow.type === type ? 'border-primary-500 bg-primary-50' : 'border-dark-200 hover:border-primary-300'}`}
                >
                  <span className="text-lg font-medium text-dark-700">
                    {type === 'single' ? 'Одностворчатое' : type === 'double' ? 'Двустворчатое' : type === 'triple' ? 'Трёхстворчатое' : 'Балконный блок'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'review':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-dark-900">{step.description}</h3>
            {windows.length > 0 ? (
              <div className="space-y-3">
                {windows.map((w, i) => (
                  <div key={i} className="bg-dark-50 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-dark-900">Окно #{i + 1}</p>
                      <p className="text-sm text-dark-600">{w.width} × {w.height} см • {calculateArea(w.width, w.height).toFixed(2)} м²</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-primary-600 font-semibold">от {estimatedPrice(calculateArea(w.width, w.height))}</span>
                      <button onClick={() => removeWindow(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-dark-500 text-center py-8">Добавьте хотя бы одно окно</p>
            )}
            {windows.length > 0 && (
              <div className="bg-primary-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark-600">Общая площадь</p>
                  <p className="text-xl font-bold text-dark-900">{windows.reduce((sum, w) => sum + calculateArea(w.width, w.height), 0).toFixed(2)} м²</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-dark-600">Примерная стоимость</p>
                  <p className="text-xl font-bold text-primary-600">от {estimatedPrice(windows.reduce((sum, w) => sum + calculateArea(w.width, w.height), 0))}</p>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <p className="text-dark-500 text-center py-8">{step.description}</p>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-primary-500 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Замер окон</h2>
          <p className="text-primary-100 text-sm">Шаг {currentStep + 1} из {steps.length}</p>
        </div>
        <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-white hover:bg-primary-600 rounded-lg transition-colors">
          <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      <div className="h-1 bg-dark-100">
        <div className="h-full bg-primary-500 transition-all duration-300" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
      </div>
      {isExpanded && (
        <div className="p-6">
          <h3 className="text-lg font-semibold text-dark-900 mb-6">{step.title}</h3>
          <div className="mb-8">{renderStepContent()}</div>
          <div className="flex items-center justify-between">
            <button onClick={prevStep} disabled={currentStep === 0} className={`px-6 py-3 rounded-xl font-medium ${currentStep === 0 ? 'text-dark-300 cursor-not-allowed' : 'text-dark-600 hover:bg-dark-100'}`}>
              Назад
            </button>
            <div className="flex gap-3">
              {!isLastStep ? (
                <button onClick={nextStep} disabled={!canProceed()} className={`px-6 py-3 rounded-xl font-medium ${canProceed() ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-dark-200 text-dark-400 cursor-not-allowed'}`}>
                  Далее
                </button>
              ) : (
                <>
                  {currentWindow.width && currentWindow.height && (
                    <button onClick={addWindow} disabled={windows.length >= maxWindows} className="px-6 py-3 rounded-xl font-medium text-primary-600 border-2 border-primary-500 hover:bg-primary-50">
                      + Добавить окно
                    </button>
                  )}
                  <button onClick={submitMeasurements} disabled={windows.length === 0} className={`px-6 py-3 rounded-xl font-medium ${windows.length > 0 ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-dark-200 text-dark-400 cursor-not-allowed'}`}>
                    Отправить на расчёт
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-dark-100 text-sm text-dark-500 flex items-center justify-between">
            <span>Добавлено окон: {windows.length} из {maxWindows}</span>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(windows.length, maxWindows) }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-primary-500" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeasurementWizard;
