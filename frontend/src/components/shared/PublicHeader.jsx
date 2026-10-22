// Title area for public content pages (Services, About, Contact).
export default function PublicHeader({ eyebrow, title, description }) {
  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14">
        {eyebrow && <p className="text-sm font-semibold text-brand-700">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-lg text-neutral-600">{description}</p>}
      </div>
    </section>
  );
}
