import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '../../../i18n/navigation';
import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import {TODO_ROY_EMAIL} from '../../../lib/constants';

export default async function ProgramPage({params}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('program');

  const phases = ['phase1', 'phase2', 'phase3'];

  return (
    <>
      <Nav />
      <main className="pb-24">
        <section className="px-5 sm:px-8 pt-28 pb-16 max-w-5xl mx-auto">
          <p className="eyebrow">{t('hero.eyebrow')}</p>
          <h1 className="font-display italic text-4xl sm:text-6xl leading-[1.05] mt-4 text-bone">
            {t('hero.title')}
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-ash leading-relaxed">
            {t('hero.subline')}
          </p>
          <p className="mt-8 inline-block border-l-2 border-gold pl-4 text-sm text-ash">
            {t('provisionalNote')}
          </p>
        </section>

        <div className="hairline mx-5 sm:mx-8 max-w-5xl md:mx-auto" />

        <section className="px-5 sm:px-8 max-w-5xl mx-auto py-16 space-y-12">
          {phases.map((key) => (
            <article
              key={key}
              className="grid md:grid-cols-[180px_1fr] gap-6 md:gap-12 border-t border-raised pt-10 first:border-t-0 first:pt-0"
            >
              <header>
                <p className="eyebrow text-gold">{t(`${key}.label`)}</p>
                <p className="mt-2 font-display text-2xl text-bone">
                  {t(`${key}.title`)}
                </p>
                <p className="mt-1 text-sm text-ash">{t(`${key}.weeks`)}</p>
              </header>
              <ul className="space-y-3">
                {t.raw(`${key}.bullets`).map((bullet, i) => (
                  <li key={i} className="flex gap-3 text-base text-bone/90">
                    <span className="text-gold">→</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <div className="hairline mx-5 sm:mx-8 max-w-5xl md:mx-auto" />

        <section className="px-5 sm:px-8 max-w-5xl mx-auto py-16">
          <p className="eyebrow">{t('throughout.title')}</p>
          <ul className="mt-6 grid sm:grid-cols-3 gap-6">
            {t.raw('throughout.items').map((item, i) => (
              <li
                key={i}
                className="bg-surface border border-raised p-6 text-base text-bone/90"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="px-5 sm:px-8 max-w-5xl mx-auto pt-8 pb-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <a
            href={`mailto:${TODO_ROY_EMAIL}`}
            className="inline-block bg-gold text-forge-black font-body uppercase tracking-[0.28em] text-xs px-7 py-4 hover:bg-gold-bright transition-colors"
          >
            {t('cta')}
          </a>
          <Link href="/" className="text-ash hover:text-bone text-sm">
            {t('back')}
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
