import { ProjectRecord, Locale } from '../types/content';
import { getProjectTranslation } from '../utils/mappers';
import { ProjectCard, TextModal } from '../shared/frontend';

type ProjectPreviewProps = {
  project: ProjectRecord;
  locale: Locale;
};

export function ProjectPreview({ project, locale }: ProjectPreviewProps) {
  const translation = getProjectTranslation(project, locale);
  const firstSection = project.sections[0]?.translations.find((item) => item.locale === locale);
  const localizedButtons = project.shared.buttons.map((button) => ({
    text: button.translations.find((item) => item.locale === locale)?.text ?? '',
    icon: button.icon,
    url: button.url,
  }));

  return (
    <div className="preview-stack">
      <ProjectCard
        project={{
          data: {
            coverImageSrc: project.shared.coverImageSrc,
            type: translation.type,
            status: translation.status,
            tittle: translation.title,
            tags: translation.tags,
          },
          header: {
            buttons: localizedButtons,
          },
        }}
        handleClick={() => undefined}
      />

      {firstSection ? (
        <TextModal
          tmContent={{
            summary: firstSection.summary,
            readMore: firstSection.readMore,
            modalContent: firstSection.modalContent,
            close: firstSection.close,
          }}
        />
      ) : null}
    </div>
  );
}
