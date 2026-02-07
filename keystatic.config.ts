import { collection, config, fields } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: {
      owner: process.env.GITHUB_OWNER || 'your-username',
      name: process.env.GITHUB_REPO || 'uws-website',
    },
  },
  collections: {
    services: collection({
      label: 'Услуги',
      slugField: 'title',
      path: 'src/content/services/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Название' } }),
        description: fields.text({ label: 'Описание', multiline: true }),
        content: fields.document({
          label: 'Контент',
          formatting: true,
          dividers: true,
          links: true,
        }),
        icon: fields.text({ label: 'Иконка (Lucide)' }),
        price: fields.text({ label: 'Цена от' }),
        features: fields.array(fields.text({ label: 'Особенность' }), {
          label: 'Особенности',
        }),
        order: fields.number({ label: 'Порядок', defaultValue: 0 }),
        published: fields.checkbox({ label: 'Опубликовано', defaultValue: false }),
      },
    }),
    blog: collection({
      label: 'Блог',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Название' } }),
        description: fields.text({ label: 'Описание', multiline: true }),
        content: fields.document({
          label: 'Контент',
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),
        publishedDate: fields.date({ label: 'Дата публикации' }),
        author: fields.text({ label: 'Автор' }),
        image: fields.image({ label: 'Изображение', directory: 'public/images/blog' }),
        tags: fields.array(fields.text({ label: 'Тег' }), { label: 'Теги' }),
        featured: fields.checkbox({ label: 'Избранное', defaultValue: false }),
        published: fields.checkbox({ label: 'Опубликовано', defaultValue: false }),
      },
    }),
    pages: collection({
      label: 'Страницы',
      slugField: 'title',
      path: 'src/content/pages/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Название' } }),
        description: fields.text({ label: 'Описание', multiline: true }),
        content: fields.document({
          label: 'Контент',
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),
        published: fields.checkbox({ label: 'Опубликовано', defaultValue: false }),
      },
    }),
    authors: collection({
      label: 'Авторы',
      slugField: 'name',
      path: 'src/content/authors/*',
      format: { contentField: 'bio' },
      schema: {
        name: fields.slug({ name: { label: 'Имя' } }),
        bio: fields.document({
          label: 'Биография',
          formatting: true,
          links: true,
        }),
        avatar: fields.image({ label: 'Аватар', directory: 'public/images/authors' }),
        role: fields.text({ label: 'Должность' }),
        published: fields.checkbox({ label: 'Опубликовано', defaultValue: false }),
      },
    }),
  },
  ui: {
    brand: {
      name: 'UWS CMS',
    },
  },
});
