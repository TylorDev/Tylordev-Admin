import { ArticleRecord, Locale, ProjectRecord } from '../types/content';

export function normalizeProjectPayload(project: ProjectRecord) {
  return {
    slug: project.slug,
    publishedAt: project.publishedAt || undefined,
    coverImageSrc: project.shared.coverImageSrc,
    coverImageAlt: project.shared.coverImageAlt,
    backgroundImage: project.shared.backgroundImage,
    backgroundAlt: project.shared.backgroundAlt,
    buttons: project.shared.buttons,
    translations: project.translations.map((translation) => ({
      locale: translation.locale,
      title: translation.title,
      status: translation.status,
      type: translation.type,
      tags: translation.tags,
      message: translation.message,
      subtitle: translation.subtitle,
    })),
    sections: project.sections.map((section) => ({
      flexDirection: section.flexDirection,
      coverImage: section.coverImage,
      translations: section.translations.map((translation) => ({
        locale: translation.locale,
        summary: translation.summary,
        readMore: translation.readMore,
        modalContent: translation.modalContent,
        close: translation.close,
      })),
    })),
  };
}

export function normalizeArticlePayload(article: ArticleRecord) {
  return {
    slug: article.slug,
    publishedAt: article.publishedAt || undefined,
    coverImageSrc: article.shared.coverImageSrc,
    bannerImage: article.shared.bannerImage,
    researchStyle: article.shared.researchStyle,
    translations: article.translations.map((translation) => ({
      locale: translation.locale,
      category: translation.category,
      title: translation.title,
      content: translation.content,
      contentTitle: translation.contentTitle,
    })),
    sections: article.sections.map((section) => ({
      translations: section.translations.map((translation) => ({
        locale: translation.locale,
        title: translation.title,
        paragraph: translation.paragraph,
      })),
      image: section.image || undefined,
    })),
  };
}

export function getProjectTranslation(project: ProjectRecord, locale: Locale) {
  return project.translations.find((translation) => translation.locale === locale)!;
}

export function getArticleTranslation(article: ArticleRecord, locale: Locale) {
  return article.translations.find((translation) => translation.locale === locale)!;
}
