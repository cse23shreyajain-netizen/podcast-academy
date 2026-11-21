export default function ProgressBar({ value }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2 w-full overflow-hidden rounded-full bg-ink/10"
    >
      <div className="h-full rounded-full bg-amber" style={{ width: `${value}%` }} />
    </div>
  );
}