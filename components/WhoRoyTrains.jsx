import {useTranslations} from 'next-intl';

export default function WhoRoyTrains() {
  const t = useTranslations('whoRoyTrains');
  const groups = t.raw('groups');

  return (
    <section className="bg-surface border-y border-raised">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow text-gold">{t('eyebrow')}</p>
          <h2 className="mt-4 font-display italic text-3xl sm:text-4xl text-bone">
            {t('title')}
          </h2>
          <p className="mt-5 text-bone/85 leading-relaxed">{t('subline')}</p>
        </div>

        <ul className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {groups.map((g) => (
            <li
              key={g.key}
              className="bg-raised border border-raised hover:border-gold/60 transition-colors px-5 py-5 sm:py-6 font-body uppercase tracking-[0.2em] text-xs sm:text-sm text-bone text-center"
            >
              {g.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
