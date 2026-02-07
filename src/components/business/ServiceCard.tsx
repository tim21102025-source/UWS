/**
 * Service Card Component
 * 
 * Card component for displaying services with icon, description and CTA.
 * 
 * @packageDocumentation
 */

import { ArrowRight } from 'lucide-react';
import React from 'react';

// ============================================
// TYPES
// ============================================

export interface ServiceCardProps {
  /** Service title */
  title: string;
  /** Service description */
  description: string;
  /** Service price or price range */
  price?: string;
  /** Icon component or name */
  icon?: React.ReactNode;
  /** Background image */
  image?: string;
  /** Link to service page */
  href?: string;
  /** Badge text */
  badge?: string;
  /** Feature list */
  features?: string[];
  /** Click handler */
  onClick?: () => void;
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
 * ServiceCard - Card component for displaying services
 * 
 * @example
 * ```tsx
 * <ServiceCard 
 *   title="Установка окон"
 *   description="Профессиональная установка пластиковых окон"
 *   price="от 2 800 ₴/м²"
 *   icon={<WindowIcon />}
 *   href="/services/ustanovka-okon"
 * />
 * ```
 */
export function ServiceCard({
  title,
  description,
  price,
  icon,
  image,
  href,
  badge,
  features,
  onClick,
}: ServiceCardProps) {
  const Component = href ? 'a' : 'div';
  const cardProps = href ? { href } : {};
  const isClickable = Boolean(href || onClick);

  return (
    <Component
      {...cardProps}
      onClick={onClick}
      className={cn(
        'group',
        'block',
        'bg-white',
        'rounded-2xl',
        'overflow-hidden',
        'border border-dark-200',
        'transition-all duration-300',
        'hover:shadow-xl',
        'hover:-translate-y-1',
        isClickable && 'cursor-pointer'
      )}
    >
      {/* Image or Icon Header */}
      <div className="relative h-48 bg-gradient-to-br from-dark-800 to-dark-900 overflow-hidden">
        {image ? (
          <>
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
          </>
        ) : icon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-primary-500/20 flex items-center justify-center">
              <div className="text-primary-400">
                {icon}
              </div>
            </div>
          </div>
        )}

        {/* Badge */}
        {badge && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-primary-500 text-dark-900 text-xs font-semibold rounded-full">
              {badge}
            </span>
          </div>
        )}

        {/* Price */}
        {price && (
          <div className="absolute bottom-4 right-4">
            <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-dark-900 text-sm font-bold rounded-lg">
              {price}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className={cn(
          'text-xl font-semibold text-dark-900 mb-2',
          'group-hover:text-primary-500',
          'transition-colors'
        )}>
          {title}
        </h3>
        
        <p className="text-dark-600 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Features */}
        {features && features.length > 0 && (
          <ul className="space-y-2 mb-4">
            {features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-dark-500">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        {href && (
          <div className="flex items-center gap-2 text-primary-500 font-medium text-sm group-hover:gap-3 transition-all">
            <span>Подробнее</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </Component>
  );
}

// ============================================
// SERVICE GRID
// ============================================

export interface ServiceGridProps {
  services: ServiceCardProps[];
  columns?: 2 | 3 | 4;
}

export function ServiceGrid({ services, columns = 3 }: ServiceGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-6', gridCols[columns])}>
      {services.map((service, index) => (
        <ServiceCard key={index} {...service} />
      ))}
    </div>
  );
}

// ============================================
// DEFAULT EXPORT
// ============================================

export default ServiceCard;
