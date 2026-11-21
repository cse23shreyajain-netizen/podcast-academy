const heights = [30, 55, 40, 80, 60, 95, 45, 70, 35, 85, 50, 65, 25, 75, 55, 90, 40, 60, 30, 50];

export default function Waveform({ className = "h-24" }) {
  return (
    <div className={`flex items-end gap-1 ${className}`} aria-hidden="true">
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-1.5 rounded-full bg-amber"
          style={{ height: `${h}%`, opacity: 0.4 + (i % 5) * 0.15 }}
        />
      ))}
    </div>
  );
}