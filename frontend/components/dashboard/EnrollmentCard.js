import Link from "next/link";
import ProgressBar from "../ui/ProgressBar";

const statusStyle = {
  active: "bg-amber/20 text-amber-dark",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function EnrollmentCard({ enrollment }) {
  const { course, status, progress, enrolledAt } = enrollment;

  return (
    <article className="rounded-xl border border-ink/10 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-dark">
            {course.category?.name}
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold">{course.title}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[status]}`}>
          {status}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
        <span className="capitalize">{course.level}</span>
        <span>{course.duration}</span>
        <span>Enrolled {new Date(enrolledAt).toLocaleDateString("en-GB")}</span>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs">
          <span>Progress</span>
          <span className="font-semibold">{progress}%</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <Link href={`/dashboard/courses/${enrollment._id}`} className="mt-4 inline-block text-sm font-semibold text-amber-dark hover:underline">
        {enrollment.courseHasLessons ? "Continue learning →" : "View course details →"}
      </Link>
    </article>
  );
}