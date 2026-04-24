export const locales = ['en-us', 'es-mx', 'pt-br'] as const;

export type Locale = (typeof locales)[number];

export type ProjectTranslation = {
  locale: Locale;
  title: string;
  status: string;
  type: string;
  tags: string;
  message: string;
  subtitle: string;
};

export type ProjectButton = {
  icon: boolean;
  url: string;
  translations: {
    locale: Locale;
    text: string;
  }[];
};

export type ProjectSectionTranslation = {
  locale: Locale;
  summary: string;
  readMore: string;
  modalContent: string;
  close: string;
};

export type ProjectSection = {
  id?: string;
  flexDirection: string;
  coverImage: string;
  translations: ProjectSectionTranslation[];
};

export type ProjectRecord = {
  id?: string;
  slug: string;
  publishedAt: string;
  shared: {
    coverImageSrc: string;
    coverImageAlt: string;
    backgroundImage: string;
    backgroundAlt: string;
    buttons: ProjectButton[];
  };
  translations: ProjectTranslation[];
  sections: ProjectSection[];
};

export type ArticleTranslation = {
  locale: Locale;
  category: string;
  title: string;
  content: string;
  contentTitle: string;
};

export type ArticleSectionTranslation = {
  locale: Locale;
  title: string;
  paragraph: string;
};

export type ArticleSection = {
  id?: string;
  image: string;
  translations: ArticleSectionTranslation[];
};

export type ArticleRecord = {
  id?: string;
  slug: string;
  publishedAt: string;
  shared: {
    coverImageSrc: string;
    bannerImage: string;
    researchStyle: {
      borderTop: string;
      borderBottom: string;
    };
  };
  translations: ArticleTranslation[];
  sections: ArticleSection[];
};
