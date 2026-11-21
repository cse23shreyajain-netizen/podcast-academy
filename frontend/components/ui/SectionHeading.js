export default function SectionHeading({ eyebrow, title, subtitle, light = false }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-dark">
          {eyebrow}
        </p>
      )}
      <h2 className={`font-display text-3xl font-bold ${light ? "text-paper" : ""}`}>{title}</h2>
      {subtitle && (
        <p className={`mt-3 text-base ${light ? "text-paper/70" : "text-muted"}`}>{subtitle}</p>
      )}
    </div>
  );
}