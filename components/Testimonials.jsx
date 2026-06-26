import Image from 'next/image';
import {useTranslations} from 'next-intl';

const avatars = [
  '/placeholders/testimonial-1.svg',
  '/placeholders/testimonial-2.svg',
  '/placeholders/testimonial-3.svg'
];

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const items = t.raw('items');

  return (
    <section className="bg-forge-black">
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

        <ul className="mt-12 grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <li
              key={i}
              className="bg-surface border border-raised p-7 flex flex-col gap-5"
            >
              <p className="font-display italic text-bone/90 text-lg leading-relaxed">
                “{item.quote}”
              </p>
              <div className="mt-auto flex items-center gap-3 pt-4 border-t border-raised">
                <div className="relative w-10 h-10 bg-raised overflow-hidden rounded-full">
                  <Image
                    src={avatars[i] ?? avatars[0]}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-body text-bone text-sm">{item.name}</div>
                  <div className="font-body text-ash text-xs uppercase tracking-[0.2em]">
                    {item.role}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
