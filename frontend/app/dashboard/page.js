"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import useEnrollments from "../../hooks/useEnrollments";
import StatCard from "../../components/dashboard/StatCard";
import EnrollmentCard from "../../components/dashboard/EnrollmentCard";
import Alert from "../../components/ui/Alert";

export default function DashboardOverview() {
  const { user } = useAuth();
  const { enrollments, loading, error } = useEnrollments();

  const total = enrollments.length;
  const completed = enrollments.filter((e) => e.status === "completed").length;
  const avg = total ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / total) : 0;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Welcome, {user.name}</h1>
      <p className="mt-1 text-muted">Here is a summary of your learning.</p>

      {error && <div className="mt-4"><Alert>{error}</Alert></div>}

      {loading ? (
        <p className="mt-8 text-muted">Loading...</p>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard label="Enrolled courses" value={total} />
            <StatCard label="Completed" value={completed} />
            <StatCard label="Average progress" value={`${avg}%`} />
          </div>

          <h2 className="mt-10 font-display text-xl font-semibold">Recent enrolments</h2>
          {total === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-ink/30 bg-white p-8 text-center">
              <p className="text-muted">You have not enrolled in any course yet.</p>
              <Link href="/dashboard/explore" className="mt-3 inline-block text-sm font-semibold underline">
                Explore courses
              </Link>
            </div>
          ) : (
            <div className="mt-4 grid gap-4">
              {enrollments.slice(0, 3).map((e) => (
                <EnrollmentCard key={e._id} enrollment={e} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}