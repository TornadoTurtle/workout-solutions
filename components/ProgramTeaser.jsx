import {useTranslations} from 'next-intl';
import {Link} from '../i18n/navigation';

export default function ProgramTeaser() {
  const t = useTranslations('programTeaser');

  return (
    <section className="bg-forge-black">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24">
        <div className="grid md:grid-cols-[1fr_auto] md:items-end gap-10 md:gap-16 border border-raised bg-surface p-8 sm:p-12">
          <div className="max-w-2xl">
            <p className="eyebrow text-gold">{t('eyebrow')}</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl text-bone leading-tight">
              {t('title')}
            </h2>
            <p className="mt-5 text-bone/85 leading-relaxed">{t('subline')}</p>
          </div>
          <Link
            href="/program"
            className="inline-block self-start md:self-end bg-gold text-forge-black font-body uppercase tracking-[0.28em] text-xs px-7 py-4 hover:bg-gold-bright transition-colors whitespace-nowrap"
          >
            {t('cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
