type Props = { title: string; phase: string; description: string };

/** Tela provisória honesta: não exibe dados fictícios. Será substituída na fase indicada. */
export function PlaceholderScreen({ title, phase, description }: Props) {
  return (
    <section className="px-4 pt-8">
      <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
      <div className="mt-6 rounded-lg border border-white/5 bg-surface-1 p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)]">
        <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
          {phase}
        </span>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">{description}</p>
      </div>
    </section>
  );
}
