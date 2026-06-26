import Image from 'next/image';
import {useTranslations} from 'next-intl';

export default function About() {
  const t = useTranslations('about');
  const paragraphs = t.raw('paragraphs');

  return (
    <section className="bg-forge-black">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24 grid md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16 items-start">
        <div className="relative w-full max-w-[240px] mx-auto md:ml-auto md:mr-0 border border-raised bg-surface overflow-hidden">
          <Image
            src="/Roy02.jpg"
            alt={t('photoAlt')}
            width={250}
            height={373}
            className="block w-full h-auto"
          />
        </div>

        <div>
          <p className="eyebrow text-gold">{t('eyebrow')}</p>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl text-bone">
            {t('title')}
          </h2>
          <div className="mt-7 space-y-5 text-bone/85 leading-relaxed">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
