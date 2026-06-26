import {useTranslations} from 'next-intl';
import {TODO_ROY_EMAIL} from '../lib/constants';

export default function Contact() {
  const t = useTranslations('contact');

  return (
    <section className="bg-surface border-y border-raised">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24 text-center">
        <p className="eyebrow text-gold">{t('eyebrow')}</p>
        <h2 className="mt-4 font-display italic text-4xl sm:text-5xl text-bone">
          {t('title')}
        </h2>
        <p className="mt-5 max-w-xl mx-auto text-bone/85 leading-relaxed">
          {t('subline')}
        </p>
        <a
          href={`mailto:${TODO_ROY_EMAIL}`}
          className="mt-9 inline-block bg-gold text-forge-black font-body uppercase tracking-[0.28em] text-xs px-9 py-4 hover:bg-gold-bright transition-colors"
        >
          {t('cta')}
        </a>
        <p className="mt-5 text-ash text-xs">{t('ctaSub')}</p>
      </div>
    </section>
  );
}
