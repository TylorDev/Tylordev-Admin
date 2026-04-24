import { ReactNode } from 'react';

type ButtonProps = {
  handleClick: () => void;
  text: string;
};

type TittleBarProps = {
  tittle: string;
  hideButtons?: boolean;
  handlePrev: () => void;
  handleNext: () => void;
};

type ProjectCardProps = {
  project: {
    data: {
      coverImageSrc: string;
      type: string;
      status: string;
      tittle: string;
      tags: string;
    };
    header?: {
      buttons?: Array<{
        text: string;
        icon: boolean;
        url: string;
      }>;
    };
  };
  handleClick: () => void;
};

type ArticleCardProps = {
  article: {
    data: {
      id?: string;
      coverImageSrc: string;
      title: string;
      content: string;
      category: string;
      date: string;
    };
  };
  handleClick: () => void;
};

type TextModalProps = {
  tmContent: {
    summary: string;
    readMore: string;
    modalContent: string;
    close: string;
  };
};

export function Button({ handleClick, text }: ButtonProps) {
  return (
    <button type="submit" className="github-login-button" onClick={handleClick}>
      {text}
    </button>
  );
}

export function TittleBar({ tittle, hideButtons = false, handlePrev, handleNext }: TittleBarProps) {
  return (
    <div className="page-title-bar">
      <h2>{tittle}</h2>
      {hideButtons ? null : (
        <div className="page-title-bar__actions">
          <button type="button" onClick={handlePrev}>
            Prev
          </button>
          <button type="button" onClick={handleNext}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export function ProjectCard({ project, handleClick }: ProjectCardProps) {
  return (
    <article className="content-card" onClick={handleClick}>
      <img src={project.data.coverImageSrc} alt={project.data.tittle} className="content-card__image" />
      <div className="content-card__meta">
        <span>{project.data.status}</span>
        <span>{project.data.type}</span>
      </div>
      <h3>{project.data.tittle}</h3>
      <p>{project.data.tags}</p>
    </article>
  );
}

export function ArticleCard({ article, handleClick }: ArticleCardProps) {
  return (
    <article className="content-card" onClick={handleClick}>
      <img src={article.data.coverImageSrc} alt={article.data.title} className="content-card__image" />
      <div className="content-card__meta">
        <span>{article.data.category}</span>
        <span>{article.data.date}</span>
      </div>
      <h3>{article.data.title}</h3>
      <p>{article.data.content}</p>
    </article>
  );
}

export function TextModal({ tmContent }: TextModalProps) {
  return (
    <section className="text-modal-preview">
      <h3>{tmContent.readMore}</h3>
      <p>{tmContent.summary}</p>
      <div>{tmContent.modalContent}</div>
      <small>{tmContent.close}</small>
    </section>
  );
}

export function CardSection({ children }: { children: ReactNode }) {
  return <div className="content-card-section">{children}</div>;
}
