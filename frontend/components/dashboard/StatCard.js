export default function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}