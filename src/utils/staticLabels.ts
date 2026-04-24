import { Locale } from '../types/content';

export const localizedStaticLabels: Record<
  Locale,
  {
    previewButton: string;
    sourceButton: string;
    readMore: string;
    previewTitle: string;
  }
> = {
  'en-us': {
    previewButton: 'See Preview',
    sourceButton: 'View Source Code',
    readMore: 'Read More',
    previewTitle: 'Preview',
  },
  'es-mx': {
    previewButton: 'Ver vista previa',
    sourceButton: 'Ver codigo fuente',
    readMore: 'Leer mas',
    previewTitle: 'Vista previa',
  },
  'pt-br': {
    previewButton: 'Ver previa',
    sourceButton: 'Ver codigo fonte',
    readMore: 'Ler mais',
    previewTitle: 'Previa',
  },
};
