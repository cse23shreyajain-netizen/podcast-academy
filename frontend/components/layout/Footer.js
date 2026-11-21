import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/70">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold text-paper">
            Podcast<span className="text-amber">Academy</span>
          </p>
          <p className="mt-2 text-sm">
            Training in podcast production and audio engineering.
          </p>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-paper">Explore</p>
          <ul className="space-y-1.5 text-sm">
            <li><Link href="/courses" className="hover:text-amber">Courses</Link></li>
            <li><Link href="/about" className="hover:text-amber">About</Link></li>
            <li><Link href="/faq" className="hover:text-amber">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-amber">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-paper">Training areas</p>
          <ul className="space-y-1.5 text-sm">
            <li>Studio Microphone Technique</li>
            <li>Audio Leveling</li>
            <li>Narrative Storytelling</li>
            <li>Distribution Setups</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs">
        © 2026 Podcast Production &amp; Audio Engineering Academy
      </div>
    </footer>
  );
}