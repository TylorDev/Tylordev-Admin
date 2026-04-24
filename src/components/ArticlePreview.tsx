import { ArticleRecord, Locale } from '../types/content';
import { getArticleTranslation } from '../utils/mappers';
import { ArticleCard } from '../shared/frontend';

type ArticlePreviewProps = {
  article: ArticleRecord;
  locale: Locale;
};

export function ArticlePreview({ article, locale }: ArticlePreviewProps) {
  const translation = getArticleTranslation(article, locale);

  return (
    <div className="preview-stack">
      <ArticleCard
        article={{
          data: {
            id: article.slug,
            coverImageSrc: article.shared.coverImageSrc,
            title: translation.title,
            content: translation.content,
            category: translation.category,
            date: article.publishedAt || 'Draft',
          },
        }}
        handleClick={() => undefined}
      />

      <div className="article-preview-copy">
        <h3>{translation.contentTitle}</h3>
        <p>{article.sections[0]?.translations.find((item) => item.locale === locale)?.paragraph ?? ''}</p>
      </div>
    </div>
  );
}
