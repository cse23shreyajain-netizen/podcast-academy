"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCourses } from "../../../services/courseService";
import { enrollInCourse } from "../../../services/enrollmentService";
import useEnrollments from "../../../hooks/useEnrollments";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";

export default function ExplorePage() {
  const { enrollments, reload } = useEnrollments();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    getCourses({ limit: 50 })
      .then((res) => setCourses(res.data.courses))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const enrolledIds = new Set(enrollments.map((e) => e.course._id));
  const available = courses.filter((c) => !enrolledIds.has(c._id));

  const handleEnrol = async (id) => {
    setBusyId(id);
    setError("");
    try {
      await enrollInCourse(id);
      await reload();
    } catch (err) {
      setError(err.message);
      await reload();
    } finally {
      setBusyId("");
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Explore Courses</h1>
      <p className="mt-1 text-muted">Courses you can enrol in.</p>

      {error && <div className="mt-4"><Alert>{error}</Alert></div>}

      {loading ? (
        <p className="mt-8 text-muted">Loading...</p>
      ) : available.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-ink/30 bg-white p-8 text-center text-muted">
          No more courses available right now.
        </p>
      ) : (
        <div className="mt-6 grid gap-4">
          {available.map((c) => (
            <article key={c._id} className="rounded-xl border border-ink/10 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-dark">
                {c.category?.name}
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted">{c.shortDescription}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <span className="text-xs capitalize text-muted">{c.level} · {c.duration}</span>
                <Link href={`/courses/${c.slug}`} className="text-sm font-semibold underline">Details</Link>
                <Button onClick={() => handleEnrol(c._id)} loading={busyId === c._id} className="ml-auto !py-2">
                  Enrol
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}