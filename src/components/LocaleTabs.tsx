import { Locale, locales } from '../types/content';

type LocaleTabsProps = {
  activeLocale: Locale;
  onChange: (locale: Locale) => void;
};

export function LocaleTabs({ activeLocale, onChange }: LocaleTabsProps) {
  return (
    <div className="locale-tabs">
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          className={locale === activeLocale ? 'active' : ''}
          onClick={() => onChange(locale)}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
