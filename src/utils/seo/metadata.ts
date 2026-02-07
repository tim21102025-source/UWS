export interface SEOMetadata {
  title: string;
  description: string;
  canonical?: string;
  robots?: string;
  og?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    url?: string;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image';
    site?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  hreflang?: {
    uk?: string;
    ru?: string;
  };
}

export function createSEOMetadata(metadata: SEOMetadata): SEOMetadata {
  const siteUrl = 'https://uws.com.ua';
  const defaultTitle = 'UWS — Профессиональная установка окон в Киеве';
  const defaultDescription = 'Установка и ремонт окон в Киеве. Немецкие профили REHAU, KBE, WDS. Гарантия 5 лет. Бесплатный замер.';

  return {
    title: metadata.title || defaultTitle,
    description: metadata.description || defaultDescription,
    canonical: metadata.canonical || `${siteUrl}${metadata.canonical || ''}`,
    robots: metadata.robots || 'index, follow',
    og: {
      title: metadata.og?.title || metadata.title || defaultTitle,
      description: metadata.og?.description || metadata.description || defaultDescription,
      image: metadata.og?.image || '/og-image.jpg',
      type: metadata.og?.type || 'website',
      url: metadata.og?.url || `${siteUrl}${metadata.canonical || ''}`,
    },
    twitter: {
      card: metadata.twitter?.card || 'summary_large_image',
      site: metadata.twitter?.site || '@uws',
      title: metadata.twitter?.title || metadata.title || defaultTitle,
      description: metadata.twitter?.description || metadata.description || defaultDescription,
      image: metadata.twitter?.image || '/og-image.jpg',
    },
    hreflang: {
      uk: metadata.hreflang?.uk || `${siteUrl}${metadata.canonical || ''}`,
      ru: metadata.hreflang?.ru || `${siteUrl}/ru${metadata.canonical || ''}`,
    },
  };
}

export function getPageMetadata(path: string, locale: 'uk' | 'ru' = 'uk'): SEOMetadata {
  const siteUrl = 'https://uws.com.ua';
  const pagePath = locale === 'ru' ? `/ru${path}` : path;

  const pageMetadata: Record<string, SEOMetadata> = {
    '/': {
      title: locale === 'uk' 
        ? 'UWS — Установка окон в Киеве' 
        : 'UWS — Установка окон в Киеве',
      description: locale === 'uk'
        ? 'Профессиональная установка и ремонт окон в Киеве. Немецкие профили REHAU, KBE, WDS. Гарантия 5 лет. Звоните: +38 066 057 52 02'
        : 'Профессиональная установка и ремонт окон в Киеве. Немецкие профили REHAU, KBE, WDS. Гарантия 5 лет. Звоните: +38 066 057 52 02',
    },
    '/about': {
      title: locale === 'uk'
        ? 'О компании UWS — Установка окон в Киеве'
        : 'О компании UWS — Установка окон в Киеве',
      description: locale === 'uk'
        ? 'UWS — ведущая компания по установке окон в Киеве. Более 10 лет на рынке, 50 000 установленных окон, гарантия 5 лет.'
        : 'UWS — ведущая компания по установке окон в Киеве. Более 10 лет на рынке, 50 000 установленных окон, гарантия 5 лет.',
    },
    '/services': {
      title: locale === 'uk'
        ? 'Услуги — UWS: установка и ремонт окон в Киеве'
        : 'Услуги — UWS: установка и ремонт окон в Киеве',
      description: locale === 'uk'
        ? 'Полный спектр услуг по окнам: установка, ремонт, регулировка, замена стеклопакетов. Работаем во всех районах Киева.'
        : 'Полный спектр услуг по окнам: установка, ремонт, регулировка, замена стеклопакетов. Работаем во всех районах Киева.',
    },
    '/calculator': {
      title: locale === 'uk'
        ? 'Калькулятор окон — UWS'
        : 'Калькулятор окон — UWS',
      description: locale === 'uk'
        ? 'Рассчитайте стоимость окон онлайн. Профессиональный калькулятор от UWS. Быстрый расчет за 5 минут.'
        : 'Рассчитайте стоимость окон онлайн. Профессиональный калькулятор от UWS. Быстрый расчет за 5 минут.',
    },
    '/blog': {
      title: locale === 'uk'
        ? 'Блог — UWS: статьи об окнах'
        : 'Блог — UWS: статьи об окнах',
      description: locale === 'uk'
        ? 'Полезные статьи об окнах: как выбрать, ухаживать, ремонтировать. Советы от экспертов UWS.'
        : 'Полезные статьи об окнах: как выбрать, ухаживать, ремонтировать. Советы от экспертов UWS.',
    },
    '/contacts': {
      title: locale === 'uk'
        ? 'Контакты — UWS'
        : 'Контакты — UWS',
      description: locale === 'uk'
        ? 'Контакты UWS: телефон +38 066 057 52 02, адрес Киев, email info@uws.com.ua. Звоните для бесплатного замера.'
        : 'Контакты UWS: телефон +38 066 057 52 02, адрес Киев, email info@uws.com.ua. Звоните для бесплатного замера.',
    },
    '/faq': {
      title: locale === 'uk'
        ? 'FAQ — Частые вопросы об окнах — UWS'
        : 'FAQ — Частые вопросы об окнах — UWS',
      description: locale === 'uk'
        ? 'Ответы на частые вопросы об окнах: выбор, установка, ремонт, уход. Эксперты UWS.'
        : 'Ответы на частые вопросы об окнах: выбор, установка, ремонт, уход. Эксперты UWS.',
    },
  };

  return pageMetadata[path] || {
    title: locale === 'uk'
      ? 'UWS — Установка окон в Киеве'
      : 'UWS — Установка окон в Киеве',
    description: locale === 'uk'
      ? 'Профессиональная установка и ремонт окон в Киеве.'
      : 'Профессиональная установка и ремонт окон в Киеве.',
  };
}
