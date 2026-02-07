/**
 * FAQ Accordion Component
 * 
 * Interactive accordion for frequently asked questions
 */

import React, { useState } from 'react';

export interface FAQItem {
  id: string;
  question: string;
  answer: React.ReactNode;
  category?: string;
  icon?: string;
}

export interface FAQAccordionProps {
  items: FAQItem[];
  title?: string;
  subtitle?: string;
  allowMultiple?: boolean;
  defaultOpenId?: string;
  variant?: 'default' | 'cards' | 'minimal';
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items,
  title = 'Частые вопросы',
  subtitle = 'Ответы на самые популярные вопросы наших клиентов',
  allowMultiple = false,
  defaultOpenId,
  variant = 'default',
}) => {
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    if (defaultOpenId) return new Set([defaultOpenId]);
    return new Set<string>();
  });

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (!allowMultiple) {
        next.clear();
        next.add(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isOpen = (id: string) => openIds.has(id);

  const containerStyles = {
    default: 'bg-white rounded-2xl shadow-lg',
    cards: 'bg-dark-50 rounded-2xl',
    minimal: '',
  };

  const itemStyles = {
    default: 'border-b border-dark-100 last:border-0',
    cards: 'bg-white rounded-xl shadow-sm mb-4 last:mb-0',
    minimal: 'border-b border-dark-200 last:border-0',
  };

  return (
    <div className={`faq-accordion ${containerStyles[variant]} p-6 md:p-8`}>
      {title && (
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-dark-900 mb-2">{title}</h2>
          {subtitle && <p className="text-dark-600">{subtitle}</p>}
        </div>
      )}

      <div className={`faq-list space-y-${variant === 'cards' ? '4' : '0'}`}>
        {items.map((item) => (
          <div
            key={item.id}
            className={`faq-item ${itemStyles[variant]} ${variant === 'cards' ? 'p-4' : 'border-b border-dark-100 last:border-0'}`}
          >
            <button
              onClick={() => toggleItem(item.id)}
              className={`faq-trigger w-full text-left flex items-center justify-between gap-4 py-4 ${variant === 'cards' ? 'py-3' : ''}`}
              aria-expanded={isOpen(item.id)}
            >
              <div className="flex items-center gap-4">
                {item.icon && (
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                )}
                <div>
                  {item.category && (
                    <span className="text-xs font-medium text-primary-600 uppercase tracking-wider mb-1 block">
                      {item.category}
                    </span>
                  )}
                  <span className={`font-semibold text-dark-900 ${variant === 'cards' ? 'text-base' : 'text-lg'}`}>
                    {item.question}
                  </span>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-dark-400 transition-transform duration-300 flex-shrink-0 ${isOpen(item.id) ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              className={`faq-content overflow-hidden transition-all duration-300 ${
                isOpen(item.id) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className={`pb-4 ${variant === 'cards' ? 'pb-2' : ''} text-dark-600 leading-relaxed`}>
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mt-8 pt-6 border-t border-dark-100 text-center">
        <p className="text-dark-600 mb-4">Не нашли ответ на свой вопрос?</p>
        <button className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
          Задать вопрос менеджеру
        </button>
      </div>
    </div>
  );
};

// Pre-built FAQ data for window/door business
export const WINDOW_FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Как выбрать правильный профиль для окон?',
    category: 'Выбор окон',
    icon: '🪟',
    answer: (
      <div>
        <p className="mb-3">При выборе оконного профиля учитывайте несколько ключевых факторов:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Климатические условия</strong> — для холодных регионов выбирайте профили с большей монтажной глубиной (70-82 мм)</li>
          <li><strong>Шумозащита</strong> — если окна выходят на шумную улицу, обратите внимание на количество камер и толщину стеклопакета</li>
          <li><strong>Энергоэффективность</strong> — профили с тёплым армированием и многокамерной структурой лучше сохраняют тепло</li>
          <li><strong>Бренд</strong> — выбирайте проверенных производителей с сертификатами качества</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'faq-2',
    question: 'Сколько времени занимает установка окон?',
    category: 'Монтаж',
    icon: '⏱️',
    answer: (
      <div>
        <p className="mb-3">Стандартная установка одного окна занимает от 1,5 до 3 часов в зависимости от сложности:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Одностворчатое окно — 1,5-2 часа</li>
          <li>Двустворчатое окно — 2-2,5 часа</li>
          <li>Трёхстворчатое окно — 2,5-3,5 часа</li>
          <li>Балконный блок — 3-4 часа</li>
        </ul>
        <p className="mt-3">Полная замена окон в квартире (3-4 окна) обычно выполняется за 1 день.</p>
      </div>
    ),
  },
  {
    id: 'faq-3',
    question: 'Какую гарантию вы предоставляете?',
    category: 'Гарантия',
    icon: '🛡️',
    answer: (
      <div>
        <p className="mb-3">Мы предоставляем комплексную гарантию:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>На профиль</strong> — 10 лет от производителя</li>
          <li><strong>На стеклопакет</strong> — 5 лет (герметичность)</li>
          <li><strong>На фурнитуру</strong> — 5 лет (механизмы открывания)</li>
          <li><strong>На монтажные работы</strong> — 3 года</li>
        </ul>
        <p className="mt-3">Также мы предлагаем постгарантийное сервисное обслуживание.</p>
      </div>
    ),
  },
  {
    id: 'faq-4',
    question: 'Нужно ли готовить помещение перед установкой?',
    category: 'Подготовка',
    icon: '🏠',
    answer: (
      <div>
        <p className="mb-3">Да, небольшая подготовка поможет ускорить процесс:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Освободите пространство вокруг окон (1-1,5 метра)</li>
          <li>Накройте мебель и пол защитной плёнкой</li>
          <li>Уберите цветы и декоративные элементы с подоконников</li>
          <li>Обеспечьте доступ к электричеству для инструментов</li>
        </ul>
        <p className="mt-3">Наши монтажники аккуратно уберут старые окна и мусор.</p>
      </div>
    ),
  },
  {
    id: 'faq-5',
    question: 'Как ухаживать за пластиковыми окнами?',
    category: 'Уход',
    icon: '✨',
    answer: (
      <div>
        <p className="mb-3">Простой уход продлевает срок службы окон:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Мойте стёкла мягкой тканью с нейтральным моющим средством</li>
          <li>Очищайте уплотнители от пыли 2 раза в год</li>
          <li>Смазывайте фурнитуру силиконовой смазкой ежегодно</li>
          <li>Не используйте абразивные средства и растворители</li>
        </ul>
        <p className="mt-3">Регулировка фурнитуры рекомендуется каждые 2-3 года.</p>
      </div>
    ),
  },
  {
    id: 'faq-6',
    question: 'Можно ли установить окна зимой?',
    category: 'Монтаж',
    icon: '❄️',
    answer: (
      <div>
        <p className="mb-3">Да, современные технологии позволяют устанавливать окна в любое время года:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Используем специальные монтажные пены для зимних условий (до -15°C)</li>
          <li>Проём остаётся открытым не более 15-20 минут</li>
          <li>Помещение не успевает остыть</li>
          <li>Качество монтажа не уступает летнему</li>
        </ul>
        <p className="mt-3">Единственное ограничение — сильные морозы ниже -15°C.</p>
      </div>
    ),
  },
];

export default FAQAccordion;
