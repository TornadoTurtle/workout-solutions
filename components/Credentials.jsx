import {useTranslations} from 'next-intl';

export default function Credentials() {
  const t = useTranslations('credentials');
  const statKeys = ['champion', 'worldRecord', 'years', 'continents'];

  return (
    <section className="bg-surface border-y border-raised">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow text-gold">{t('eyebrow')}</p>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl text-bone">
            {t('title')}
          </h2>
        </div>

        <ul className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {statKeys.map((k) => (
            <li key={k} className="border-l-2 border-gold pl-4 sm:pl-5">
              <div className="font-display text-gold text-3xl sm:text-4xl leading-none">
                {t(`stats.${k}.value`)}
              </div>
              <div className="mt-2 font-body uppercase tracking-[0.18em] text-[0.7rem] text-ash leading-snug">
                {t(`stats.${k}.label`)}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid md:grid-cols-2 gap-10 sm:gap-16">
          <TitleList
            title={t('powerlifting.title')}
            items={t.raw('powerlifting.items')}
          />
          <TitleList
            title={t('bodybuilding.title')}
            items={t.raw('bodybuilding.items')}
          />
        </div>
      </div>
    </section>
  );
}

function TitleList({title, items}) {
  return (
    <div>
      <p className="font-display italic text-xl text-gold">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-bone/85 text-sm sm:text-base leading-relaxed border-t border-raised pt-2.5 first:border-t-0 first:pt-0"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
