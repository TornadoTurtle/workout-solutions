import {useTranslations} from 'next-intl';
import {Link} from '../i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import {TODO_ROY_EMAIL} from '../lib/constants';

export default function Nav() {
  const t = useTranslations('nav');

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-forge-black/85 backdrop-blur border-b border-raised">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-body uppercase tracking-[0.32em] text-[0.72rem] text-bone group-hover:text-gold-bright transition-colors">
            {t('brand')}
          </span>
          <span className="font-display italic text-gold text-[0.78rem] mt-0.5">
            {t('brandSub')}
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <LanguageSwitcher />
          <a
            href={`mailto:${TODO_ROY_EMAIL}`}
            className="hidden sm:inline-block bg-gold text-forge-black font-body uppercase tracking-[0.24em] text-[0.68rem] px-4 py-2.5 hover:bg-gold-bright transition-colors"
          >
            {t('cta')}
          </a>
        </div>
      </div>
    </header>
  );
}
