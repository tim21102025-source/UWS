/**
 * Testimonials Carousel Component
 * 
 * Interactive carousel for customer testimonials
 */

import React, { useCallback, useEffect, useState } from 'react';

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  service: string;
  project?: string;
  rating: number;
  text: string;
  avatar?: string;
  projectImage?: string;
  date?: string;
  verified?: boolean;
}

export interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
  autoplay?: boolean;
  autoplayInterval?: number;
  showNavigation?: boolean;
  showDots?: boolean;
  variant?: 'cards' | 'grid' | 'featured';
  visibleCount?: number;
}

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  testimonials,
  title = 'Отзывы клиентов',
  subtitle = 'Более 500 довольных клиентов за 10 лет работы',
  autoplay = true,
  autoplayInterval = 5000,
  showNavigation = true,
  showDots = true,
  variant = 'cards',
  visibleCount = 1,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / visibleCount));
  }, [testimonials.length, visibleCount]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(testimonials.length / visibleCount)) % Math.ceil(testimonials.length / visibleCount));
  }, [testimonials.length, visibleCount]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (!autoplay || isPaused) return;
    const timer = setInterval(nextSlide, autoplayInterval);
    return () => clearInterval(timer);
  }, [autoplay, autoplayInterval, nextSlide, isPaused]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-dark-200'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const visibleTestimonials = () => {
    const start = currentIndex * visibleCount;
    return testimonials.slice(start, start + visibleCount);
  };

  if (variant === 'grid') {
    return (
      <div className="testimonials-grid py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-dark-900 mb-2">{title}</h2>
          <p className="text-dark-600">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} renderStars={renderStars} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className="testimonials-featured py-12 bg-dark-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-dark-900 mb-2">{title}</h2>
            <p className="text-dark-600">{subtitle}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {testimonials.slice(0, 2).map((testimonial) => (
              <FeaturedTestimonial key={testimonial.id} testimonial={testimonial} renderStars={renderStars} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="testimonials-carousel py-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-dark-900 mb-2">{title}</h2>
        <p className="text-dark-600">{subtitle}</p>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3">
                <TestimonialCard testimonial={testimonial} renderStars={renderStars} />
              </div>
            ))}
          </div>
        </div>

        {showNavigation && testimonials.length > visibleCount && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-dark-600 hover:bg-primary-500 hover:text-white transition-all"
              aria-label="Предыдущий отзыв"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-dark-600 hover:bg-primary-500 hover:text-white transition-all"
              aria-label="Следующий отзыв"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {showDots && testimonials.length > visibleCount && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(testimonials.length / visibleCount) }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentIndex ? 'bg-primary-500 w-8' : 'bg-dark-300 hover:bg-dark-400'
                }`}
                aria-label={`Отзыв ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard: React.FC<{ testimonial: Testimonial; renderStars: (rating: number) => React.ReactNode }> = ({
  testimonial,
  renderStars,
}) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
    {testimonial.projectImage && (
      <div className="h-40 overflow-hidden">
        <img
          src={testimonial.projectImage}
          alt={testimonial.project || 'Проект'}
          className="w-full h-full object-cover"
        />
      </div>
    )}
    <div className="p-6 flex-1 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg overflow-hidden">
          {testimonial.avatar ? (
            <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
          ) : (
            testimonial.name.charAt(0)
          )}
        </div>
        <div>
          <p className="font-semibold text-dark-900 flex items-center gap-2">
            {testimonial.name}
            {testimonial.verified && (
              <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </p>
          <p className="text-sm text-dark-500">{testimonial.city}</p>
        </div>
      </div>

      <div className="mb-3">{renderStars(testimonial.rating)}</div>

      <p className="text-dark-600 leading-relaxed flex-1">{testimonial.text}</p>

      <div className="mt-4 pt-4 border-t border-dark-100">
        <p className="text-xs text-dark-400">
          <span className="font-medium text-dark-600">{testimonial.service}</span>
          {testimonial.project && ` • ${testimonial.project}`}
          {testimonial.date && ` • ${testimonial.date}`}
        </p>
      </div>
    </div>
  </div>
);

// Featured Testimonial Component
const FeaturedTestimonial: React.FC<{ testimonial: Testimonial; renderStars: (rating: number) => React.ReactNode }> = ({
  testimonial,
  renderStars,
}) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    <div className="flex flex-col md:flex-row">
      {testimonial.projectImage && (
        <div className="md:w-1/2 h-64 md:h-auto">
          <img
            src={testimonial.projectImage}
            alt={testimonial.project || 'Проект'}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-8 md:w-1/2 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl overflow-hidden">
            {testimonial.avatar ? (
              <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
            ) : (
              testimonial.name.charAt(0)
            )}
          </div>
          <div>
            <p className="font-semibold text-dark-900 text-lg">{testimonial.name}</p>
            <p className="text-sm text-dark-500">{testimonial.city}</p>
          </div>
        </div>

        <div className="mb-4">{renderStars(testimonial.rating)}</div>

        <blockquote className="text-dark-700 text-lg leading-relaxed italic mb-4">
          "{testimonial.text}"
        </blockquote>

        <p className="text-sm text-dark-500">
          {testimonial.service}{testimonial.project && ` • ${testimonial.project}`}
        </p>
      </div>
    </div>
  </div>
);

// Sample testimonials data
export const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Александр Петров',
    city: 'Киев',
    service: 'Установка окон',
    project: '5 окон в 3-комнатной квартире',
    rating: 5,
    text: 'Отличная работа! Ребята установили 5 окон за один день, всё аккуратно, мусор убрали. Окна тёплые, шум с улицы не слышно. Цена порадовала, монтажники вежливые.',
    date: 'Декабрь 2024',
    verified: true,
  },
  {
    id: 't2',
    name: 'Мария Коваленко',
    city: 'Одесса',
    service: 'Остекление балкона',
    project: 'Балкон под ключ',
    rating: 5,
    text: 'Превратили наш холодный балкон в уютную комнату! Сделали всё быстро и качественно. Теперь там кабинет для работы. Спасибо за профессионализм!',
    date: 'Ноябрь 2024',
    verified: true,
  },
  {
    id: 't3',
    name: 'Дмитрий Савченко',
    city: 'Львов',
    service: 'Замена окон',
    project: 'Дом в пригороде',
    rating: 5,
    text: 'Заказали замену окон в частном доме. Очень довольны результатом! Дом стал намного теплее, счета за отопление уменьшились. Рекомендую!',
    date: 'Октябрь 2024',
    verified: true,
  },
  {
    id: 't4',
    name: 'Елена Мороз',
    city: 'Харьков',
    service: 'Ремонт окон',
    project: 'Регулировка фурнитуры',
    rating: 5,
    text: 'Окна начали плохо закрываться, вызвали мастера. Приехал через день, всё исправил за 30 минут. Вежливый, аккуратный. Цена адекватная.',
    date: 'Ноябрь 2024',
    verified: true,
  },
  {
    id: 't5',
    name: 'Сергей Волошин',
    city: 'Днепр',
    service: 'Установка дверей',
    project: 'Входная и межкомнатные двери',
    rating: 5,
    text: 'Заказывали входную металлическую дверь и 4 межкомнатные. Всё супер! Двери красивые, установлены идеально. Никаких нареканий.',
    date: 'Сентябрь 2024',
    verified: true,
  },
  {
    id: 't6',
    name: 'Анна Попова',
    city: 'Винница',
    service: 'Консультация и замер',
    project: 'Загородный дом',
    rating: 5,
    text: 'Очень благодарна менеджеру за подробную консультацию! Помог выбрать оптимальный вариант остекления. Приехал замерщик, всё померил, составил смету. Осталось довольными.',
    date: 'Октябрь 2024',
    verified: true,
  },
];

export default TestimonialsCarousel;
