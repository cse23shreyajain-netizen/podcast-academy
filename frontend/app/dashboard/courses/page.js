"use client";

import Link from "next/link";
import useEnrollments from "../../../hooks/useEnrollments";
import EnrollmentCard from "../../../components/dashboard/EnrollmentCard";
import Alert from "../../../components/ui/Alert";

export default function MyCoursesPage() {
  const { enrollments, loading, error } = useEnrollments();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">My Courses</h1>
      <p className="mt-1 text-muted">Courses you are enrolled in.</p>

      {error && <div className="mt-4"><Alert>{error}</Alert></div>}

      {loading ? (
        <p className="mt-8 text-muted">Loading...</p>
      ) : enrollments.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-ink/30 bg-white p-8 text-center">
          <p className="text-muted">No enrolled courses yet.</p>
          <Link href="/dashboard/explore" className="mt-3 inline-block text-sm font-semibold underline">
            Explore courses
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {enrollments.map((e) => (
            <EnrollmentCard key={e._id} enrollment={e} />
          ))}
        </div>
      )}
    </div>
  );
}