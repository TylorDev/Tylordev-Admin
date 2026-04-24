import { ArticleRecord, Locale, ProjectRecord, locales } from "../types/content";

const isFilled = (value: string | undefined | null) => Boolean(value?.trim());

function missingLocales<T extends { locale: Locale }>(
  entries: T[],
  predicate: (entry: T) => boolean,
) {
  return locales.filter((locale) => {
    const entry = entries.find((item) => item.locale === locale);
    return !entry || !predicate(entry);
  });
}

export function validateProject(project: ProjectRecord) {
  const errors: string[] = [];

  if (!isFilled(project.shared.coverImageSrc)) errors.push("Falta la cover image.");
  if (!isFilled(project.shared.backgroundImage)) errors.push("Falta la banner image.");

  const translationMissing = missingLocales(
    project.translations,
    (entry) =>
      isFilled(entry.title) &&
      isFilled(entry.status) &&
      isFilled(entry.type) &&
      isFilled(entry.tags) &&
      isFilled(entry.subtitle),
  );

  if (translationMissing.length) {
    errors.push(`Faltan campos obligatorios en idiomas: ${translationMissing.join(", ")}.`);
  }

  project.shared.buttons.forEach((button, index) => {
    if (!isFilled(button.url)) {
      errors.push(`Falta la URL del boton ${index + 1}.`);
    }

    const buttonMissing = missingLocales(button.translations, (entry) => isFilled(entry.text));
    if (buttonMissing.length) {
      errors.push(`Faltan textos del boton ${index + 1} en: ${buttonMissing.join(", ")}.`);
    }
  });

  if (!project.sections.length) {
    errors.push("Debes agregar al menos una seccion.");
  }

  project.sections.forEach((section, index) => {
    if (!isFilled(section.coverImage)) {
      errors.push(`Falta la imagen de la seccion ${index + 1}.`);
    }

    const sectionMissing = missingLocales(
      section.translations,
      (entry) =>
        isFilled(entry.summary) &&
        isFilled(entry.readMore) &&
        isFilled(entry.modalContent) &&
        isFilled(entry.close),
    );

    if (sectionMissing.length) {
      errors.push(`Faltan traducciones en la seccion ${index + 1}: ${sectionMissing.join(", ")}.`);
    }
  });

  return errors;
}

export function validateArticle(article: ArticleRecord) {
  const errors: string[] = [];

  if (!isFilled(article.shared.coverImageSrc)) errors.push("Falta la cover image.");
  if (!isFilled(article.shared.bannerImage)) errors.push("Falta la banner image.");

  const translationMissing = missingLocales(
    article.translations,
    (entry) =>
      isFilled(entry.category) &&
      isFilled(entry.title) &&
      isFilled(entry.content) &&
      isFilled(entry.contentTitle),
  );

  if (translationMissing.length) {
    errors.push(`Faltan campos obligatorios en idiomas: ${translationMissing.join(", ")}.`);
  }

  if (!article.sections.length) {
    errors.push("Debes agregar al menos una seccion.");
  }

  article.sections.forEach((section, index) => {
    const sectionMissing = missingLocales(
      section.translations,
      (entry) => isFilled(entry.title) && isFilled(entry.paragraph),
    );

    if (sectionMissing.length) {
      errors.push(`Faltan traducciones en la seccion ${index + 1}: ${sectionMissing.join(", ")}.`);
    }
  });

  return errors;
}
