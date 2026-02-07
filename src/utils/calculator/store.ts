// Zustand store для калькулятора окон UWS
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { calculatePrice, clearHistory, getHistory, saveToHistory } from './pricing';
import type { CalculationHistory, CalculatorConfig, PriceBreakdown } from './types';

interface CalculatorState {
  // Текущая конфигурация
  config: CalculatorConfig;
  // Рассчитанная стоимость
  breakdown: PriceBreakdown | null;
  // История расчётов
  history: CalculationHistory[];
  // Флаг редактирования истории
  isEditingHistory: boolean;
  
  // Actions
  setWindowType: (type: CalculatorConfig['windowType']) => void;
  setDimensions: (width: number, height: number) => void;
  setProfile: (profileId: string) => void;
  setGlazing: (glazingId: string) => void;
  setHardware: (hardwareId: string) => void;
  toggleExtra: (extraId: string) => void;
  setIncludeInstallation: (include: boolean) => void;
  resetConfig: () => void;
  calculate: () => void;
  saveCalculation: () => void;
  loadFromHistory: (id: string) => void;
  deleteFromHistory: (id: string) => void;
  clearAllHistory: () => void;
}

// Начальная конфигурация
const defaultConfig: CalculatorConfig = {
  windowType: 'double',
  width: 150,
  height: 150,
  profileId: 'standard',
  glazingId: 'double',
  hardwareId: 'siegenia',
  extras: [],
  includeInstallation: true,
};

// Функция для вычисления стоимости
const calculateBreakdown = (config: CalculatorConfig): PriceBreakdown => {
  return calculatePrice(config);
};

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      // Initial state
      config: defaultConfig,
      breakdown: null,
      history: [],
      isEditingHistory: false,

      // Actions
      setWindowType: (windowType) => {
        set((state) => {
          const newConfig = { ...state.config, windowType };
          return {
            config: newConfig,
            breakdown: calculateBreakdown(newConfig),
          };
        });
      },

      setDimensions: (width, height) => {
        set((state) => {
          const newConfig = { ...state.config, width, height };
          return {
            config: newConfig,
            breakdown: calculateBreakdown(newConfig),
          };
        });
      },

      setProfile: (profileId) => {
        set((state) => {
          const newConfig = { ...state.config, profileId };
          return {
            config: newConfig,
            breakdown: calculateBreakdown(newConfig),
          };
        });
      },

      setGlazing: (glazingId) => {
        set((state) => {
          const newConfig = { ...state.config, glazingId };
          return {
            config: newConfig,
            breakdown: calculateBreakdown(newConfig),
          };
        });
      },

      setHardware: (hardwareId) => {
        set((state) => {
          const newConfig = { ...state.config, hardwareId };
          return {
            config: newConfig,
            breakdown: calculateBreakdown(newConfig),
          };
        });
      },

      toggleExtra: (extraId) => {
        set((state) => {
          const extras = state.config.extras.includes(extraId)
            ? state.config.extras.filter((id) => id !== extraId)
            : [...state.config.extras, extraId];
          const newConfig = { ...state.config, extras };
          return {
            config: newConfig,
            breakdown: calculateBreakdown(newConfig),
          };
        });
      },

      setIncludeInstallation: (includeInstallation) => {
        set((state) => {
          const newConfig = { ...state.config, includeInstallation };
          return {
            config: newConfig,
            breakdown: calculateBreakdown(newConfig),
          };
        });
      },

      resetConfig: () => {
        set({
          config: defaultConfig,
          breakdown: calculateBreakdown(defaultConfig),
        });
      },

      calculate: () => {
        const { config } = get();
        set({ breakdown: calculateBreakdown(config) });
      },

      saveCalculation: () => {
        const { config, breakdown } = get();
        if (breakdown) {
          saveToHistory(config, breakdown);
          set({ history: getHistory() });
        }
      },

      loadFromHistory: (id) => {
        const { history } = get();
        const item = history.find((h) => h.id === id);
        if (item) {
          set({
            config: item.config,
            breakdown: item.breakdown,
          });
        }
      },

      deleteFromHistory: (id) => {
        const { history } = get();
        const newHistory = history.filter((h) => h.id !== id);
        localStorage.setItem('uws-calculator-history', JSON.stringify(newHistory));
        set({ history: newHistory });
      },

      clearAllHistory: () => {
        clearHistory();
        set({ history: [] });
      },
    }),
    {
      name: 'uws-calculator',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ config: state.config }),
    }
  )
);

// Инициализация истории при загрузке
if (typeof window !== 'undefined') {
  useCalculatorStore.setState({ history: getHistory() });
}
