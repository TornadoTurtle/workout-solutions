import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {TODO_ROY_EMAIL} from '../lib/constants';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32 pb-20 sm:pb-28 bg-forge-black">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.18]"
        style={{
          background:
            'radial-gradient(60% 50% at 80% 10%, rgba(200,161,75,0.35), transparent 60%), radial-gradient(40% 40% at 10% 90%, rgba(156,107,60,0.3), transparent 65%)'
        }}
      />
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-center">
        <div>
          <p className="eyebrow text-gold">{t('eyebrow')}</p>
          <h1 className="mt-6 font-display italic text-[2rem] sm:text-5xl md:text-[3.4rem] leading-[1.08] text-bone">
            “{t('motto')}”
          </h1>
          <p className="mt-7 max-w-xl text-base sm:text-lg text-bone/80 leading-relaxed">
            {t('subline')}
          </p>
          <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <a
              href={`mailto:${TODO_ROY_EMAIL}`}
              className="inline-block bg-gold text-forge-black font-body uppercase tracking-[0.28em] text-xs px-7 py-4 hover:bg-gold-bright transition-colors"
            >
              {t('cta')}
            </a>
            <span className="text-ash text-xs sm:text-sm">{t('ctaSub')}</span>
          </div>
        </div>

        <div className="relative w-full max-w-[260px] mx-auto md:mr-0 md:ml-auto border border-raised bg-surface overflow-hidden">
          <Image
            src="/Roy01.jpg"
            alt={t('photoAlt')}
            width={274}
            height={289}
            priority
            className="block w-full h-auto"
          />
          <div className="absolute inset-0 ring-1 ring-gold/20 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
