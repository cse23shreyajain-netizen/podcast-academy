"use client";

import { useEffect, useState } from "react";
import { getStats } from "../../services/adminService";
import StatCard from "../../components/dashboard/StatCard";
import Alert from "../../components/ui/Alert";

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getStats()
      .then((res) => {
        if (active) setData(res.data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Admin dashboard</h1>
      {error && <div className="mt-4"><Alert>{error}</Alert></div>}
      {!data && !error ? <p className="mt-6 text-muted">Loading dashboard...</p> : null}
      {data && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Students" value={data.stats.totalStudents} />
            <StatCard label="Instructors" value={data.stats.totalInstructors} />
            <StatCard label="Courses" value={data.stats.totalCourses} />
            <StatCard label="Published courses" value={data.stats.publishedCourses} />
            <StatCard label="Draft courses" value={data.stats.draftCourses} />
            <StatCard label="Enrolments" value={data.stats.totalEnrollments} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-ink/10 bg-white p-5">
              <h2 className="font-display text-lg font-semibold">Recent students</h2>
              {data.recentStudents.length ? (
                <ul className="mt-3 divide-y divide-ink/10">
                  {data.recentStudents.map((student) => (
                    <li key={student._id} className="py-3">
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted">{student.email}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted">No students yet.</p>
              )}
            </section>

            <section className="rounded-xl border border-ink/10 bg-white p-5">
              <h2 className="font-display text-lg font-semibold">Recent enrolments</h2>
              {data.recentEnrollments.length ? (
                <ul className="mt-3 divide-y divide-ink/10">
                  {data.recentEnrollments.map((enrollment) => (
                    <li key={enrollment._id} className="py-3">
                      <p className="font-medium">{enrollment.student?.name || "Student unavailable"}</p>
                      <p className="text-sm text-muted">{enrollment.course?.title || "Course unavailable"}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted">No enrolments yet.</p>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
