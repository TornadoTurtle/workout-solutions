import {useTranslations} from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forge-black border-t border-raised">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 flex flex-col sm:flex-row gap-6 sm:items-end sm:justify-between">
        <div>
          <div className="font-body uppercase tracking-[0.32em] text-[0.72rem] text-bone">
            {t('brand')}
          </div>
          <div className="font-display italic text-gold mt-1">
            {t('brandSub')}
          </div>
          <p className="mt-4 text-ash text-sm max-w-md">{t('tagline')}</p>
        </div>
        <div className="text-ash text-xs space-y-2 sm:text-right">
          <div className="uppercase tracking-[0.24em]">{t('languages')}</div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 sm:justify-end">
            <span>© {year} · {t('copyright').replace(/^©\s*/, '')}</span>
            <span className="text-ash/60 uppercase tracking-[0.18em]">{t('versionStamp')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
