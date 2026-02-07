export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  priceFrom: number;
  features: string[];
}

export const services: Service[] = [
  {
    id: 'window-installation',
    title: 'Установка окон',
    description: 'Профессиональная установка окон ПВХ любой сложности',
    icon: 'window',
    priceFrom: 2800,
    features: ['Гарантия 5 лет', 'Немецкие профили', 'Быстрый монтаж'],
  },
  {
    id: 'window-repair',
    title: 'Ремонт окон',
    description: 'Ремонт и обслуживание оконных конструкций',
    icon: 'wrench',
    priceFrom: 500,
    features: ['Выезд мастера', 'Оригинальные запчасти', 'Гарантия на работу'],
  },
  {
    id: 'balcony',
    title: 'Балконы и лоджии',
    description: 'Остекление и отделка балконов под ключ',
    icon: 'home',
    priceFrom: 15000,
    features: ['Теплое и холодное остекление', 'Внутренняя отделка', 'Вынос балкона'],
  },
  {
    id: 'mosquito-nets',
    title: 'Москитные сетки',
    description: 'Изготовление и установка москитных сеток',
    icon: 'shield',
    priceFrom: 400,
    features: ['Разные типы крепления', 'Антикошка', 'Антипыль'],
  },
  {
    id: 'glass-replacement',
    title: 'Замена стеклопакетов',
    description: 'Замена стеклопакетов в существующих окнах',
    icon: 'layers',
    priceFrom: 1500,
    features: ['Энергосберегающие', 'Шумоизоляция', 'Безрамное остекление'],
  },
  {
    id: 'door-closers',
    title: 'Доводчики для дверей',
    description: 'Установка и настройка дверных доводчиков',
    icon: 'door',
    priceFrom: 800,
    features: ['Европейские бренды', 'Регулировка скорости', 'Гарантия 2 года'],
  },
];

export const getServiceById = (id: string): Service | undefined => {
  return services.find((service) => service.id === id);
};
