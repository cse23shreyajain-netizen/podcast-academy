import { faqGroups } from "../../utils/faqData";

export const metadata = { title: "FAQ | Podcast Academy" };

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-4xl font-bold">Frequently asked questions</h1>
      <div className="mt-10 space-y-10">
        {faqGroups.map((group) => (
          <section key={group.title}>
            <h2 className="mb-3 font-display text-xl font-semibold">{group.title}</h2>
            <div className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white">
              {group.items.map((item) => (
                <details key={item.q} className="group p-4">
                  <summary className="cursor-pointer list-none font-medium marker:hidden">
                    {item.q}
                  </summary>
                  <p className="mt-2 text-sm text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}