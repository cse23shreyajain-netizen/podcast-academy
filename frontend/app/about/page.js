import SectionHeading from "../../components/ui/SectionHeading";

export const metadata = { title: "About | Podcast Academy" };

const blocks = [
  { title: "Mission", text: "To make podcast production and audio engineering skills accessible through clear, structured online training." },
  { title: "Vision", text: "A community of creators who can record, shape and publish audio with confidence." },
  { title: "Learning approach", text: "Each course is organised around one training area, with defined outcomes and a curriculum overview so you always know what you will learn." },
  { title: "Training philosophy", text: "Good audio is a craft. We focus on fundamentals first: microphone technique, levels, storytelling and distribution." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <SectionHeading
        eyebrow="About"
        title="Podcast Production & Audio Engineering Academy"
        subtitle="An online academy built around four core training areas."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {blocks.map((b) => (
          <div key={b.title} className="rounded-xl border border-ink/10 bg-white p-6">
            <h3 className="font-display text-xl font-semibold">{b.title}</h3>
            <p className="mt-2 text-muted">{b.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}