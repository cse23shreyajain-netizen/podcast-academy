"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { getCourseBySlug } from "../../services/courseService";
import { enrollInCourse, getMyEnrollments } from "../../services/enrollmentService";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

export default function CourseDetail({ slug }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    getCourseBySlug(slug)
      .then((res) => setCourse(res.data.course))
      .catch((err) => setError(err.status === 404 ? "Course not found." : err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  // Student ke liye: pehle se enrolled hai?
  useEffect(() => {
    if (!course || user?.role !== "student") return;
    getMyEnrollments()
      .then((res) => setEnrolled(res.data.enrollments.some((e) => e.course?._id === course._id)))
      .catch(() => {});
  }, [course, user]);

  const handleEnroll = async () => {
    if (!user) return router.push("/login");
    setEnrolling(true);
    setMessage({ type: "", text: "" });
    try {
      await enrollInCourse(course._id);
      setEnrolled(true);
      setMessage({ type: "success", text: "You are now enrolled in this course." });
    } catch (err) {
      if (err.status === 409) setEnrolled(true);
      setMessage({ type: "error", text: err.message });
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <p className="py-20 text-center text-muted">Loading course...</p>;
  if (error)
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <Alert>{error}</Alert>
        <Link href="/courses" className="mt-4 inline-block text-sm font-semibold underline">
          Back to courses
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Link href="/courses" className="text-sm text-muted hover:underline">← All courses</Link>

      <div className="mt-6 grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-dark">
            {course.category?.name}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold">{course.title}</h1>
          <p className="mt-3 text-lg text-muted">{course.shortDescription}</p>

          {course.image && (
            <img src={course.image} alt="" className="mt-6 h-72 w-full rounded-xl object-cover" />
          )}

          <section className="mt-8">
            <h2 className="font-display text-xl font-semibold">About this course</h2>
            <p className="mt-2 whitespace-pre-line text-muted">{course.description}</p>
          </section>

          {course.learningOutcomes?.length > 0 && (
            <section className="mt-8">
              <h2 className="font-display text-xl font-semibold">What you will learn</h2>
              <ul className="mt-3 space-y-2">
                {course.learningOutcomes.map((o) => (
                  <li key={o} className="flex gap-3 text-muted">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber" />
                    {o}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {course.curriculumOverview?.length > 0 && (
            <section className="mt-8">
              <h2 className="font-display text-xl font-semibold">Curriculum preview</h2>
              <ol className="mt-3 divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white">
                {course.curriculumOverview.map((item, i) => (
                  <li key={item._id || i} className="p-4">
                    <p className="font-medium">{i + 1}. {item.title}</p>
                    {item.description && <p className="mt-1 text-sm text-muted">{item.description}</p>}
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <aside className="h-fit rounded-xl border border-ink/10 bg-white p-6">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Level</dt><dd className="font-medium capitalize">{course.level}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Duration</dt><dd className="font-medium">{course.duration}</dd></div>
          </dl>

          <div className="mt-6 space-y-3">
            <Alert type={message.type || "error"}>{message.text}</Alert>

            {authLoading ? null : user && user.role !== "student" ? (
              <p className="text-sm text-muted">Only student accounts can enrol.</p>
            ) : enrolled ? (
              <Button href="/dashboard" variant="secondary" className="w-full">Go to dashboard</Button>
            ) : (
              <Button onClick={handleEnroll} loading={enrolling} className="w-full">
                {user ? "Enrol now" : "Login to enrol"}
              </Button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}