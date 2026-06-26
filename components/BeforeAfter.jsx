'use client';

import {useEffect, useState} from 'react';
import {ReactCompareSlider, ReactCompareSliderImage} from 'react-compare-slider';
import {useTranslations} from 'next-intl';

export default function BeforeAfter() {
  const t = useTranslations('beforeAfter');
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="bg-surface border-y border-raised">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow text-gold">{t('eyebrow')}</p>
          <h2 className="mt-4 font-display italic text-3xl sm:text-4xl text-bone">
            {t('title')}
          </h2>
          <p className="mt-4 inline-block border border-gold/40 text-gold text-[0.7rem] uppercase tracking-[0.2em] px-3 py-1.5">
            {t('placeholderLabel')}
          </p>
        </div>

        <div className="mt-10 mx-auto w-full max-w-[420px] aspect-[4/5] border border-raised overflow-hidden bg-raised">
          {mounted ? (
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage
                  src="/placeholders/before.svg"
                  alt={t('before')}
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  src="/placeholders/after.svg"
                  alt={t('after')}
                />
              }
              position={50}
              style={{width: '100%', height: '100%'}}
            />
          ) : (
            <img
              src="/placeholders/before.svg"
              alt={t('before')}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <p className="mt-4 text-ash text-sm text-center">{t('caption')}</p>
      </div>
    </section>
  );
}
