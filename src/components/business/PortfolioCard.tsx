/**
 * Portfolio Card Component
 * 
 * Card component for displaying portfolio projects with before/after comparison.
 * 
 * @packageDocumentation
 */

import { ArrowRight, Calendar, Image, MapPin } from 'lucide-react';
import { useState } from 'react';

// ============================================
// TYPES
// ============================================

export interface PortfolioCardProps {
  /** Project title */
  title: string;
  /** Project description */
  description?: string;
  /** Main image */
  image: string;
  /** Before image (optional) */
  beforeImage?: string;
  /** After image (optional) */
  afterImage?: string;
  /** Project category */
  category: string;
  /** Project location */
  location?: string;
  /** Project date */
  date?: string;
  /** Profile systems used */
  profiles?: string[];
  /** Client testimonial */
  testimonial?: string;
  /** Client name */
  clientName?: string;
  /** Link to full project */
  href?: string;
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
 * PortfolioCard - Card component for displaying portfolio projects
 * 
 * @example
 * ```tsx
 * <PortfolioCard
 *   title="Панорамное остекление квартиры"
 *   category="Квартиры"
 *   location="Киев, ЖК Park Avenue"
 *   image="/images/project-1.jpg"
 *   profiles={["REHAU Geneo", "Guardian Glass"]}
 * />
 * ```
 */
export function PortfolioCard({
  title,
  description,
  image,
  beforeImage,
  afterImage,
  category,
  location,
  date,
  profiles,
  testimonial,
  clientName,
  href,
}: PortfolioCardProps) {
  const [showBefore, setShowBefore] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const comparisonImage = showBefore && beforeImage ? beforeImage : afterImage || image;
  const showComparison = Boolean(beforeImage && afterImage);

  return (
    <article
      className={cn(
        'group',
        'bg-white',
        'rounded-2xl',
        'overflow-hidden',
        'border border-dark-200',
        'shadow-sm',
        'transition-all duration-300',
        'hover:shadow-xl'
      )}
    >
      {/* Image Section */}
      <div 
        className="relative h-64 overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => href && window.open(href, '_blank')}
      >
        <img
          src={showComparison ? comparisonImage : image}
          alt={title}
          className={cn(
            'w-full h-full object-cover',
            'transition-transform duration-500',
            isHovered && 'scale-105'
          )}
        />

        {/* Overlay */}
        <div className={cn(
          'absolute inset-0',
          'bg-gradient-to-t from-dark-900/80 via-dark-900/20 to-transparent',
          'opacity-0 group-hover:opacity-100',
          'transition-opacity duration-300',
          'flex items-end p-6'
        )}>
          {/* Category Badge */}
          <span className="px-3 py-1 bg-primary-500 text-dark-900 text-xs font-semibold rounded-full">
            {category}
          </span>
        </div>

        {/* Before/After Toggle */}
        {showComparison && (
          <div className="absolute top-4 left-4">
            <div className="flex bg-dark-900/80 backdrop-blur-sm rounded-lg p-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBefore(true);
                }}
                className={cn(
                  'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                  showBefore
                    ? 'bg-primary-500 text-dark-900'
                    : 'text-white hover:text-primary-400'
                )}
              >
                До
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBefore(false);
                }}
                className={cn(
                  'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                  !showBefore
                    ? 'bg-primary-500 text-dark-900'
                    : 'text-white hover:text-primary-400'
                )}
              >
                После
              </button>
            </div>
          </div>
        )}

        {/* Gallery Icon */}
        {afterImage && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 px-2 py-1 bg-dark-900/60 backdrop-blur-sm rounded text-white text-xs">
              <Image className="w-4 h-4" />
              <span>2 фото</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Category & Location */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-medium text-primary-500 uppercase tracking-wide">
            {category}
          </span>
          {location && (
            <>
              <span className="w-1 h-1 rounded-full bg-dark-300" />
              <span className="flex items-center gap-1 text-sm text-dark-500">
                <MapPin className="w-4 h-4" />
                {location}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-dark-900 mb-2 group-hover:text-primary-500 transition-colors">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-dark-600 mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Profiles Used */}
        {profiles && profiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {profiles.map((profile, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-dark-100 text-dark-600 text-xs rounded-md"
              >
                {profile}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-dark-200">
          <div className="flex items-center gap-3">
            {date && (
              <span className="flex items-center gap-1 text-sm text-dark-500">
                <Calendar className="w-4 h-4" />
                {date}
              </span>
            )}
          </div>

          {href && (
            <a
              href={href}
              className="flex items-center gap-1 text-primary-500 font-medium text-sm hover:gap-2 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <span>Подробнее</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Testimonial */}
        {testimonial && (
          <blockquote className="mt-4 p-4 bg-dark-50 rounded-xl">
            <p className="text-sm text-dark-600 italic mb-2">"{testimonial}"</p>
            {clientName && (
              <cite className="text-sm font-medium text-dark-900 not-italic">
                — {clientName}
              </cite>
            )}
          </blockquote>
        )}
      </div>
    </article>
  );
}

// ============================================
// PORTFOLIO GRID
// ============================================

export interface PortfolioGridProps {
  projects: PortfolioCardProps[];
  columns?: 2 | 3;
}

export function PortfolioGrid({ projects, columns = 3 }: PortfolioGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <div className={cn('grid gap-6', gridCols[columns])}>
      {projects.map((project, index) => (
        <PortfolioCard key={index} {...project} />
      ))}
    </div>
  );
}

// ============================================
// DEFAULT EXPORT
// ============================================

export default PortfolioCard;
