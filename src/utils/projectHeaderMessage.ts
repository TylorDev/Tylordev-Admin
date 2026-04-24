import { Locale } from '../types/content';

const projectHeaderMessage: Record<Locale, string> = {
  'en-us': 'Next',
  'es-mx': 'Siguiente',
  'pt-br': 'Proximo',
};

export function getProjectHeaderMessage(locale: Locale) {
  return projectHeaderMessage[locale];
}
