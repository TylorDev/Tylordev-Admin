import {
  ArticleRecord,
  ArticleSection,
  ArticleSectionTranslation,
  ArticleTranslation,
  Locale,
  ProjectRecord,
  ProjectSection,
  ProjectSectionTranslation,
  ProjectTranslation,
  locales,
} from '../types/content';
import { getProjectHeaderMessage } from './projectHeaderMessage';
import { localizedStaticLabels } from './staticLabels';

function projectTranslation(locale: Locale): ProjectTranslation {
  return {
    locale,
    title: '',
    status: '',
    type: '',
    tags: '',
    message: getProjectHeaderMessage(locale),
    subtitle: '',
  };
}

function projectSectionTranslation(locale: Locale): ProjectSectionTranslation {
  return {
    locale,
    summary: '',
    readMore: localizedStaticLabels[locale].readMore,
    modalContent: '',
    close: 'X',
  };
}

function articleTranslation(locale: Locale): ArticleTranslation {
  return {
    locale,
    category: '',
    title: '',
    content: '',
    contentTitle: '',
  };
}

function articleSectionTranslation(locale: Locale): ArticleSectionTranslation {
  return {
    locale,
    title: '',
    paragraph: '',
  };
}

export function createEmptyProjectSection(): ProjectSection {
  return {
    flexDirection: 'row',
    coverImage: '',
    translations: locales.map(projectSectionTranslation),
  };
}

export function createEmptyProject(): ProjectRecord {
  return {
    slug: '',
    publishedAt: '',
    shared: {
      coverImageSrc: '',
      coverImageAlt: 'project-cover',
      backgroundImage: '',
      backgroundAlt: 'project-banner',
      buttons: [
        {
          icon: true,
          url: '',
          translations: locales.map((locale) => ({
            locale,
            text: localizedStaticLabels[locale].previewButton,
          })),
        },
        {
          icon: true,
          url: '',
          translations: locales.map((locale) => ({
            locale,
            text: localizedStaticLabels[locale].sourceButton,
          })),
        },
      ],
    },
    translations: locales.map(projectTranslation),
    sections: [createEmptyProjectSection()],
  };
}

export function createEmptyArticleSection(): ArticleSection {
  return {
    image: '',
    translations: locales.map(articleSectionTranslation),
  };
}

export function createEmptyArticle(): ArticleRecord {
  return {
    slug: '',
    publishedAt: '',
    shared: {
      coverImageSrc: '',
      bannerImage: '',
      researchStyle: {
        borderTop: '2px solid white',
        borderBottom: 'none',
      },
    },
    translations: locales.map(articleTranslation),
    sections: [createEmptyArticleSection()],
  };
}
