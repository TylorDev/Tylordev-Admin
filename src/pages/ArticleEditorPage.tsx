import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { extractApiErrors } from '../api/client';
import { createArticle, deleteArticle, getArticle, updateArticle } from '../api/articles';
import { LocaleTabs } from '../components/LocaleTabs';
import { ArticlePreview } from '../components/ArticlePreview';
import { Button, TittleBar } from '../shared/frontend';
import { ArticleRecord, Locale } from '../types/content';
import { createEmptyArticle, createEmptyArticleSection } from '../utils/factories';
import { createBaseSlug } from '../utils/slug';
import { localizedStaticLabels } from '../utils/staticLabels';
import { validateArticle } from '../utils/validation';

type ArticleEditorPageProps = {
  mode: 'create' | 'edit';
};

export function ArticleEditorPage({ mode }: ArticleEditorPageProps) {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [article, setArticle] = useState<ArticleRecord>(createEmptyArticle());
  const [activeLocale, setActiveLocale] = useState<Locale>('es-mx');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (mode === 'edit' && slug) {
      getArticle(slug).then(setArticle);
    }
  }, [mode, slug]);

  const translation = useMemo(
    () => article.translations.find((item) => item.locale === activeLocale)!,
    [article, activeLocale],
  );

  function syncSlugWithEnglishTitle(translations: ArticleRecord['translations']) {
    const englishTitle = translations.find((item) => item.locale === 'en-us')?.title ?? '';
    return englishTitle.trim() ? createBaseSlug(englishTitle) : '';
  }

  function updateTranslation(field: keyof typeof translation, value: string) {
    setArticle((current) => {
      const translations = current.translations.map((item) =>
        item.locale === activeLocale ? { ...item, [field]: value } : item,
      );

      return {
        ...current,
        slug: field === 'title' && activeLocale === 'en-us' ? syncSlugWithEnglishTitle(translations) : current.slug,
        translations,
      };
    });
  }

  function updateSectionTranslation(index: number, field: string, value: string) {
    setArticle((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) =>
        sectionIndex === index
          ? {
              ...section,
              translations: section.translations.map((item) =>
                item.locale === activeLocale ? { ...item, [field]: value } : item,
              ),
            }
          : section,
      ),
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFeedback(null);

    const errors = validateArticle(article);
    setValidationErrors(errors);

    if (errors.length) {
      setFeedback({
        type: 'error',
        message: 'No se pudo guardar. Completa todos los idiomas y campos obligatorios.',
      });
      return;
    }

    setSaving(true);

    try {
      if (mode === 'create') {
        const created = await createArticle(article);
        setValidationErrors([]);
        setFeedback({ type: 'success', message: `Post guardado correctamente: ${created.slug}` });
        navigate(`/articles/${created.slug}`);
      } else if (slug) {
        const updated = await updateArticle(slug, article);
        setArticle({
          ...updated,
          publishedAt: updated.publishedAt ? updated.publishedAt.slice(0, 10) : '',
        });
        setValidationErrors([]);
        setFeedback({ type: 'success', message: `Post actualizado correctamente: ${updated.slug}` });
      }
    } catch (error) {
      const apiErrors = extractApiErrors(error);
      setValidationErrors(apiErrors);
      setFeedback({ type: 'error', message: apiErrors[0] ?? 'Ocurrio un error inesperado al guardar el post.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!slug) return;
    await deleteArticle(slug);
    navigate('/articles');
  }

  return (
    <section className="admin-page editor-page">
      <div className="page-toolbar">
        <TittleBar
          tittle={mode === 'create' ? 'Nuevo post' : `Post: ${article.slug || slug}`}
          handlePrev={() => undefined}
          handleNext={() => undefined}
          hideButtons={true}
        />
        <LocaleTabs activeLocale={activeLocale} onChange={setActiveLocale} />
      </div>

      <div className="editor-layout">
        <form className="editor-form" onSubmit={handleSubmit}>
          {feedback ? (
            <div className={`form-feedback ${feedback.type}`}>
              <strong>{feedback.type === 'success' ? 'Guardado' : 'Error'}</strong>
              <span>{feedback.message}</span>
            </div>
          ) : null}

          {validationErrors.length ? (
            <div className="validation-summary">
              {validationErrors.map((error) => (
                <div key={error}>{error}</div>
              ))}
            </div>
          ) : null}

          <div className="form-grid">
            <label>
              <span>Slug</span>
              <input value={article.slug} readOnly />
              <small className="field-help">Se genera automaticamente desde el titulo. Si ya existe, el backend agregara un sufijo unico.</small>
            </label>
            <label>
              <span>Fecha publicación</span>
              <input
                type="date"
                value={article.publishedAt}
                onChange={(event) => setArticle({ ...article, publishedAt: event.target.value })}
              />
            </label>
            <label>
              <span>Cover image</span>
              <input
                value={article.shared.coverImageSrc}
                onChange={(event) =>
                  setArticle({ ...article, shared: { ...article.shared, coverImageSrc: event.target.value } })
                }
              />
            </label>
            <label>
              <span>Banner image</span>
              <input
                value={article.shared.bannerImage}
                onChange={(event) =>
                  setArticle({ ...article, shared: { ...article.shared, bannerImage: event.target.value } })
                }
              />
            </label>
            <label>
              <span>Categoria</span>
              <input value={translation.category} onChange={(event) => updateTranslation('category', event.target.value)} />
            </label>
            <label>
              <span>Titulo</span>
              <input value={translation.title} onChange={(event) => updateTranslation('title', event.target.value)} />
            </label>
            <label>
              <span>Resumen corto</span>
              <input value={translation.content} onChange={(event) => updateTranslation('content', event.target.value)} />
            </label>
          </div>

          <label>
            <span>Titulo principal</span>
            <textarea value={translation.contentTitle} onChange={(event) => updateTranslation('contentTitle', event.target.value)} />
          </label>

          <div className="repeatable-block">
            <div className="repeatable-block__header">
              <h3>Secciones</h3>
              <button type="button" onClick={() => setArticle({ ...article, sections: [...article.sections, createEmptyArticleSection()] })}>
                Agregar seccion
              </button>
            </div>

            {article.sections.map((section, index) => {
              const localeSection = section.translations.find((item) => item.locale === activeLocale)!;

              return (
                <div key={`${section.image}-${index}`} className="section-box">
                  <label>
                    <span>Imagen</span>
                    <input
                      value={section.image}
                      onChange={(event) =>
                        setArticle((current) => ({
                          ...current,
                          sections: current.sections.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, image: event.target.value } : item,
                          ),
                        }))
                      }
                    />
                  </label>
                  <label>
                    <span>Subtitulo</span>
                    <input
                      value={localeSection.title}
                      onChange={(event) => updateSectionTranslation(index, 'title', event.target.value)}
                    />
                  </label>
                  <label>
                    <span>Parrafo</span>
                    <textarea
                      value={localeSection.paragraph}
                      onChange={(event) => updateSectionTranslation(index, 'paragraph', event.target.value)}
                    />
                  </label>
                </div>
              );
            })}
          </div>

          <div className="editor-actions">
            <Button handleClick={() => undefined} text={saving ? 'Guardando...' : 'Guardar post'} />
            {mode === 'edit' ? (
              <button type="button" className="danger-button" onClick={handleDelete}>
                Eliminar
              </button>
            ) : null}
          </div>
        </form>

        <aside className="preview-panel">
          <TittleBar
            tittle={`${localizedStaticLabels[activeLocale].previewTitle} ${activeLocale}`}
            handlePrev={() => undefined}
            handleNext={() => undefined}
            hideButtons={true}
          />
          <ArticlePreview article={article} locale={activeLocale} />
        </aside>
      </div>
    </section>
  );
}
