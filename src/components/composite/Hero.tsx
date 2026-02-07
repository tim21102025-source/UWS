/**
 * Hero Component
 * 
 * Hero section with title, subtitle, CTA buttons and background.
 * 
 * @packageDocumentation
 */

import { ArrowRight, Calculator } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface HeroProps {
  /** Hero title */
  title: string;
  /** Hero subtitle/description */
  subtitle?: string;
  /** Primary CTA button text */
  ctaText?: string;
  /** Primary CTA link */
  ctaLink?: string;
  /** Secondary CTA button text */
  secondaryText?: string;
  /** Secondary CTA link */
  secondaryLink?: string;
  /** Background image URL */
  backgroundImage?: string;
  /** Background video URL */
  backgroundVideo?: string;
  /** Overlay opacity */
  overlay?: 'none' | 'light' | 'medium' | 'dark';
  /** Text align */
  align?: 'left' | 'center' | 'right';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Badge text */
  badge?: string;
}

// ============================================
// HELPER
// ============================================

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * Hero - Hero section component with CTAs
 * 
 * @example
 * ```tsx
 * <Hero
 *   title="Профессиональная установка окон в Киеве"
 *   subtitle="Немецкие профили REHAU с гарантией 10 лет"
 *   ctaText="Рассчитать стоимость"
 *   ctaLink="/calculator"
 *   badge="Скидка 15% до конца месяца"
 *   backgroundImage="/images/hero-bg.jpg"
 * />
 * ```
 */
export function Hero({
  title,
  subtitle,
  ctaText = 'Рассчитать стоимость',
  ctaLink = '/calculator',
  secondaryText,
  secondaryLink,
  backgroundImage,
  backgroundVideo,
  overlay = 'dark',
  align = 'left',
  size = 'lg',
  badge,
}: HeroProps) {
  const overlayClasses = {
    none: '',
    light: 'bg-gradient-to-br from-white/40 via-white/20 to-transparent',
    medium: 'bg-gradient-to-br from-dark-900/60 via-dark-900/40 to-transparent',
    dark: 'bg-gradient-to-br from-dark-900/80 via-dark-900/60 to-dark-900/40',
  };

  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  const sizeClasses = {
    sm: 'py-12 md:py-16',
    md: 'py-16 md:py-24',
    lg: 'py-20 md:py-32',
  };

  return (
    <section
      className={cn(
        'relative',
        'overflow-hidden',
        'flex flex-col',
        sizeClasses[size],
        alignClasses[align],
        'min-h-[600px]'
      )}
    >
      {/* Background */}
      {(backgroundImage || backgroundVideo) && (
        <div className="absolute inset-0 z-0">
          {backgroundVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={backgroundVideo} type="video/mp4" />
            </video>
          ) : backgroundImage && (
            <img
              src={backgroundImage}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
          <div className={cn('absolute inset-0', overlayClasses[overlay])} />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className={cn('max-w-3xl', align === 'center' && 'mx-auto')}>
          {/* Badge */}
          {badge && (
            <span className={cn(
              'inline-block px-4 py-2 bg-primary-500 text-dark-900',
              'text-sm font-semibold rounded-full',
              'mb-4',
              align === 'center' && 'mx-auto'
            )}>
              {badge}
            </span>
          )}

          {/* Title */}
          <h1 className={cn(
            'font-heading',
            'font-bold',
            'text-dark-900',
            'leading-tight',
            'mb-4',
            'text-4xl md:text-5xl lg:text-6xl',
            !backgroundImage && !backgroundVideo && 'text-dark-900',
            backgroundImage || backgroundVideo ? 'text-white' : ''
          )}>
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className={cn(
              'text-lg md:text-xl',
              'mb-8',
              backgroundImage || backgroundVideo ? 'text-white/90' : 'text-dark-600',
              'max-w-2xl'
            )}>
              {subtitle}
            </p>
          )}

          {/* CTA Buttons */}
          {(ctaText || secondaryText) && (
            <div className={cn(
              'flex flex-wrap gap-4',
              align === 'center' && 'justify-center',
              align === 'right' && 'justify-end'
            )}>
              {ctaText && (
                <a
                  href={ctaLink}
                  className={cn(
                    'inline-flex items-center gap-2',
                    'px-8 py-4',
                    'bg-primary-500 hover:bg-primary-600',
                    'text-dark-900 font-semibold',
                    'rounded-xl',
                    'transition-all duration-200',
                    'hover:scale-105',
                    'shadow-lg hover:shadow-xl'
                  )}
                >
                  <Calculator className="w-5 h-5" />
                  {ctaText}
                  <ArrowRight className="w-5 h-5" />
                </a>
              )}

              {secondaryText && (
                <a
                  href={secondaryLink}
                  className={cn(
                    'inline-flex items-center gap-2',
                    'px-8 py-4',
                    'border-2',
                    backgroundImage || backgroundVideo
                      ? 'border-white text-white hover:bg-white hover:text-dark-900'
                      : 'border-dark-300 text-dark-700 hover:border-dark-900 hover:text-dark-900',
                    'font-semibold rounded-xl',
                    'transition-all duration-200'
                  )}
                >
                  {secondaryText}
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      {(backgroundImage || backgroundVideo) && (
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />
      )}
    </section>
  );
}

// ============================================
// DEFAULT EXPORT
// ============================================

export default Hero;
