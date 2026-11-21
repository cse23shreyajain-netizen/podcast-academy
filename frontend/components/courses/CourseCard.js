import Link from "next/link";

export default function CourseCard({ course }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-white transition-shadow hover:shadow-lg">
      {course.image ? (
        <img src={course.image} alt="" className="h-44 w-full object-cover" />
      ) : (
        <div className="flex h-44 items-end bg-gradient-to-br from-ink to-ink-soft p-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber">
            {course.category?.name}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted">
          <span className="rounded-full bg-ink/5 px-2.5 py-1 font-medium capitalize">{course.level}</span>
          <span>{course.duration}</span>
        </div>
        <h3 className="font-display text-lg font-semibold">{course.title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted">{course.shortDescription}</p>
        <Link
          href={`/courses/${course.slug}`}
          className="mt-4 text-sm font-semibold text-amber-dark hover:underline"
        >
          View course →
        </Link>
      </div>
    </article>
  );
}