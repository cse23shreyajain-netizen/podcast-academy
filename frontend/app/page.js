import Link from "next/link";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";
import Waveform from "../components/ui/Waveform";
import FeaturedCourses from "../components/home/FeaturedCourses";
import { faqGroups } from "../utils/faqData";

const areas = [
  { title: "Studio Microphone Technique", text: "Choose, place and handle microphones for clean recordings." },
  { title: "Audio Leveling", text: "Balance voices, music and effects so every episode sounds consistent." },
  { title: "Narrative Storytelling", text: "Structure episodes that hold a listener's attention." },
  { title: "Distribution Setups", text: "Prepare, publish and distribute your show to listening platforms." },
];

const reasons = [
  { title: "Focused training areas", text: "Four clear areas instead of a scattered catalogue." },
  { title: "Know before you enrol", text: "Every course lists outcomes, level, duration and curriculum." },
  { title: "Free direct enrolment", text: "Create an account and enrol straight away." },
  { title: "Track your progress", text: "Your dashboard shows every course you are taking." },
];

const steps = ["Create a free account", "Choose a course", "Enrol", "Track your progress"];

export default function HomePage() {
  const faqPreview = faqGroups.flatMap((g) => g.items).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber">
              Podcast production academy
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl">
              Learn to record, shape and publish great audio.
            </h1>
            <p className="mt-5 max-w-lg text-paper/70">
              Structured online training in microphone technique, audio leveling, storytelling and distribution.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/courses">Browse courses</Button>
              <Button href="/register" variant="outline" className="!border-paper !text-paper hover:!bg-paper hover:!text-ink">
                Create account
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-ink-soft p-8">
            <Waveform className="h-40" />
          </div>
        </div>
      </section>

      {/* Training areas */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="What you will learn" title="Four core training areas" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((a, i) => (
            <div key={a.title} className="rounded-xl border border-ink/10 bg-white p-5">
              <span className="font-display text-2xl font-bold text-amber-dark">0{i + 1}</span>
              <h3 className="mt-2 font-display font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm text-muted">{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured courses */}
      <section className="bg-ink/[0.03] py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="Courses" title="Featured courses" />
          <FeaturedCourses />
          <div className="mt-8 text-center">
            <Button href="/courses" variant="outline">See all courses</Button>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="Why choose us" title="Built for clear, steady learning" />
        <div className="grid gap-5 sm:grid-cols-2">
          {reasons.map((r) => (
            <div key={r.title} className="flex gap-4 rounded-xl border border-ink/10 bg-white p-5">
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-amber" />
              <div>
                <h3 className="font-display font-semibold">{r.title}</h3>
                <p className="mt-1 text-sm text-muted">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="bg-ink py-16 text-paper">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading light eyebrow="Learning process" title="How it works" />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s} className="rounded-xl border border-line bg-ink-soft p-5">
                <span className="font-display text-3xl font-bold text-amber">{i + 1}</span>
                <p className="mt-2 font-medium">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Instructor (sample) */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <SectionHeading eyebrow="Instructors" title="Meet your instructors" />
        <div className="rounded-xl border border-dashed border-ink/30 bg-white p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Sample content</p>
          <p className="mt-2 font-display text-lg font-semibold">Instructor profile</p>
          <p className="mt-1 text-sm text-muted">
            Instructor details will appear here once approved content is available.
          </p>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="mx-auto max-w-3xl px-4 pb-16">
        <SectionHeading eyebrow="FAQ" title="Common questions" />
        <div className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white">
          {faqPreview.map((item) => (
            <details key={item.q} className="p-4">
              <summary className="cursor-pointer list-none font-medium marker:hidden">{item.q}</summary>
              <p className="mt-2 text-sm text-muted">{item.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-4 text-center text-sm">
          <Link href="/faq" className="font-semibold underline">See all questions</Link>
        </p>
      </section>

      {/* CTA */}
      <section className="bg-amber">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-12 text-center">
          <h2 className="font-display text-3xl font-bold text-ink">Have a question?</h2>
          <p className="text-ink/80">Get in touch and we will help you pick the right course.</p>
          <Button href="/contact" variant="secondary">Contact us</Button>
        </div>
      </section>
    </>
  );
}