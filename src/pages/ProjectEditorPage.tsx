import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { extractApiErrors } from '../api/client';
import { createProject, deleteProject, getProject, updateProject } from '../api/projects';
import { LocaleTabs } from '../components/LocaleTabs';
import { ProjectPreview } from '../components/ProjectPreview';
import { Button, TittleBar } from '../shared/frontend';
import { Locale, ProjectRecord } from '../types/content';
import { createEmptyProject, createEmptyProjectSection } from '../utils/factories';
import { createBaseSlug } from '../utils/slug';
import { getProjectHeaderMessage } from '../utils/projectHeaderMessage';
import { localizedStaticLabels } from '../utils/staticLabels';
import { validateProject } from '../utils/validation';

type ProjectEditorPageProps = {
  mode: 'create' | 'edit';
};

export function ProjectEditorPage({ mode }: ProjectEditorPageProps) {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [project, setProject] = useState<ProjectRecord>(createEmptyProject());
  const [activeLocale, setActiveLocale] = useState<Locale>('es-mx');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (mode === 'edit' && slug) {
      getProject(slug).then(setProject);
    }
  }, [mode, slug]);

  const translation = useMemo(
    () => project.translations.find((item) => item.locale === activeLocale)!,
    [project, activeLocale],
  );

  function syncSlugWithEnglishTitle(translations: ProjectRecord['translations']) {
    const englishTitle = translations.find((item) => item.locale === 'en-us')?.title ?? '';
    return englishTitle.trim() ? createBaseSlug(englishTitle) : '';
  }

  function updateTranslation(field: keyof typeof translation, value: string) {
    setProject((current) => {
      const translations = current.translations.map((item) =>
        item.locale === activeLocale
          ? {
              ...item,
              [field]:
                field === 'message'
                  ? getProjectHeaderMessage(activeLocale)
                  : value,
              message: getProjectHeaderMessage(item.locale),
            }
          : {
              ...item,
              message: getProjectHeaderMessage(item.locale),
            },
      );

      return {
        ...current,
        slug: field === 'title' && activeLocale === 'en-us' ? syncSlugWithEnglishTitle(translations) : current.slug,
        translations,
      };
    });
  }

  function updateSectionTranslation(index: number, field: string, value: string) {
    setProject((current) => ({
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

  function applyLocalizedStaticTexts(locale: Locale) {
    setProject((current) => ({
      ...current,
      shared: {
        ...current.shared,
        buttons: current.shared.buttons.map((button, index) => ({
          ...button,
          translations: button.translations.map((translation) => {
            const fallbackText =
              index === 0 ? localizedStaticLabels[translation.locale].previewButton : localizedStaticLabels[translation.locale].sourceButton;

            return translation.locale === locale
              ? {
                  ...translation,
                  text: index === 0 ? localizedStaticLabels[locale].previewButton : localizedStaticLabels[locale].sourceButton,
                }
              : translation.text
                ? translation
                : { ...translation, text: fallbackText };
          }),
        })),
      },
      sections: current.sections.map((section) => ({
        ...section,
        translations: section.translations.map((translation) =>
          translation.locale === locale
            ? { ...translation, readMore: localizedStaticLabels[locale].readMore }
            : translation.readMore
              ? translation
              : { ...translation, readMore: localizedStaticLabels[translation.locale].readMore },
        ),
      })),
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFeedback(null);

    const errors = validateProject(project);
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
        const created = await createProject(project);
        setValidationErrors([]);
        setFeedback({ type: 'success', message: `Proyecto guardado correctamente: ${created.slug}` });
        navigate(`/projects/${created.slug}`);
      } else if (slug) {
        const updated = await updateProject(slug, project);
        setProject({
          ...updated,
          publishedAt: updated.publishedAt ? updated.publishedAt.slice(0, 10) : '',
        });
        setValidationErrors([]);
        setFeedback({ type: 'success', message: `Proyecto actualizado correctamente: ${updated.slug}` });
      }
    } catch (error) {
      const apiErrors = extractApiErrors(error);
      setValidationErrors(apiErrors);
      setFeedback({ type: 'error', message: apiErrors[0] ?? 'Ocurrio un error inesperado al guardar el proyecto.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!slug) return;
    await deleteProject(slug);
    navigate('/projects');
  }

  return (
    <section className="admin-page editor-page">
      <div className="page-toolbar">
        <TittleBar
          tittle={mode === 'create' ? 'Nuevo proyecto' : `Proyecto: ${project.slug || slug}`}
          handlePrev={() => undefined}
          handleNext={() => undefined}
          hideButtons={true}
        />
        <LocaleTabs
          activeLocale={activeLocale}
          onChange={(locale) => {
            setActiveLocale(locale);
            applyLocalizedStaticTexts(locale);
          }}
        />
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
              <input value={project.slug} readOnly />
              <small className="field-help">Se genera automaticamente desde el titulo. Si ya existe, el backend agregara un sufijo unico.</small>
            </label>
            <label>
              <span>Fecha publicación</span>
              <input
                type="date"
                value={project.publishedAt}
                onChange={(event) => setProject({ ...project, publishedAt: event.target.value })}
              />
            </label>
            <label>
              <span>Cover image</span>
              <input
                value={project.shared.coverImageSrc}
                onChange={(event) =>
                  setProject({ ...project, shared: { ...project.shared, coverImageSrc: event.target.value } })
                }
              />
            </label>
            <label>
              <span>Banner image</span>
              <input
                value={project.shared.backgroundImage}
                onChange={(event) =>
                  setProject({ ...project, shared: { ...project.shared, backgroundImage: event.target.value } })
                }
              />
            </label>
            <label>
              <span>Status</span>
              <input value={translation.status} onChange={(event) => updateTranslation('status', event.target.value)} />
            </label>
            <label>
              <span>Tipo</span>
              <input value={translation.type} onChange={(event) => updateTranslation('type', event.target.value)} />
            </label>
            <label>
              <span>Titulo</span>
              <input value={translation.title} onChange={(event) => updateTranslation('title', event.target.value)} />
            </label>
            <label>
              <span>Tags</span>
              <input value={translation.tags} onChange={(event) => updateTranslation('tags', event.target.value)} />
            </label>
          </div>

          <label>
            <span>Subtitulo</span>
            <textarea value={translation.subtitle} onChange={(event) => updateTranslation('subtitle', event.target.value)} />
          </label>

          <div className="repeatable-block">
            <div className="repeatable-block__header">
              <h3>Botones</h3>
            </div>
            {project.shared.buttons.map((button, index) => (
              <div key={`button-${index}`} className="section-box">
                <div className="form-grid">
                  <label>
                    <span>Texto</span>
                    <input
                      value={button.translations.find((item) => item.locale === activeLocale)?.text ?? ''}
                      onChange={(event) =>
                        setProject((current) => ({
                          ...current,
                          shared: {
                            ...current.shared,
                            buttons: current.shared.buttons.map((item, itemIndex) =>
                              itemIndex === index
                                ? {
                                    ...item,
                                    translations: item.translations.map((translation) =>
                                      translation.locale === activeLocale
                                        ? { ...translation, text: event.target.value }
                                        : translation,
                                    ),
                                  }
                                : item,
                            ),
                          },
                        }))
                      }
                    />
                  </label>
                  <label>
                    <span>URL</span>
                    <input
                      value={button.url}
                      onChange={(event) =>
                        setProject((current) => ({
                          ...current,
                          shared: {
                            ...current.shared,
                            buttons: current.shared.buttons.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, url: event.target.value } : item,
                            ),
                          },
                        }))
                      }
                    />
                  </label>
                </div>
                <small className="field-help">
                  Texto estatico por idioma. Cambia al cambiar el selector de locale.
                </small>
              </div>
            ))}
          </div>

          <div className="repeatable-block">
            <div className="repeatable-block__header">
              <h3>Secciones</h3>
              <button type="button" onClick={() => setProject({ ...project, sections: [...project.sections, createEmptyProjectSection()] })}>
                Agregar seccion
              </button>
            </div>

            {project.sections.map((section, index) => {
              const localeSection = section.translations.find((item) => item.locale === activeLocale)!;

              return (
                <div key={`${section.coverImage}-${index}`} className="section-box">
                  <div className="form-grid">
                    <label>
                      <span>Imagen</span>
                      <input
                        value={section.coverImage}
                        onChange={(event) =>
                          setProject((current) => ({
                            ...current,
                            sections: current.sections.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, coverImage: event.target.value } : item,
                            ),
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span>Direccion</span>
                      <select
                        value={section.flexDirection}
                        onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                          setProject((current) => ({
                            ...current,
                            sections: current.sections.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, flexDirection: event.target.value } : item,
                            ),
                          }))
                        }
                      >
                        <option value="row">row</option>
                        <option value="row-reverse">row-reverse</option>
                      </select>
                    </label>
                  </div>

                  <label>
                    <span>Resumen</span>
                    <textarea
                      value={localeSection.summary}
                      onChange={(event) => updateSectionTranslation(index, 'summary', event.target.value)}
                    />
                  </label>
                  <label>
                    <span>CTA</span>
                    <input
                      value={localeSection.readMore}
                      onChange={(event) => updateSectionTranslation(index, 'readMore', event.target.value)}
                    />
                  </label>
                  <label>
                    <span>Contenido modal</span>
                    <textarea
                      value={localeSection.modalContent}
                      onChange={(event) => updateSectionTranslation(index, 'modalContent', event.target.value)}
                    />
                  </label>
                </div>
              );
            })}
          </div>

          <div className="editor-actions">
            <Button handleClick={() => undefined} text={saving ? 'Guardando...' : 'Guardar proyecto'} />
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
          <ProjectPreview project={project} locale={activeLocale} />
        </aside>
      </div>
    </section>
  );
}
