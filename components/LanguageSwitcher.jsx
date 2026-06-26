'use client';

import {useLocale, useTranslations} from 'next-intl';
import {ACTIVE_LOCALES, LOCALES} from '../lib/constants';
import {usePathname, useRouter} from '../i18n/navigation';

export default function LanguageSwitcher() {
  const current = useLocale();
  const t = useTranslations('languageSwitcher');
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav aria-label={t('label')} className="flex items-center gap-1 text-[0.7rem] font-body tracking-[0.24em]">
      {LOCALES.map((loc, i) => {
        const active = loc === current;
        const enabled = ACTIVE_LOCALES.includes(loc);
        const label = t(loc);
        return (
          <span key={loc} className="flex items-center">
            {i > 0 && <span className="text-ash/40 mx-1.5">·</span>}
            {enabled ? (
              <button
                type="button"
                onClick={() => router.replace(pathname, {locale: loc})}
                className={
                  active
                    ? 'text-gold cursor-default'
                    : 'text-bone hover:text-gold-bright transition-colors'
                }
                aria-current={active ? 'true' : undefined}
              >
                {label}
              </button>
            ) : (
              <span
                title={t('comingSoon')}
                className="text-ash/50 cursor-not-allowed"
                aria-disabled="true"
              >
                {label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
