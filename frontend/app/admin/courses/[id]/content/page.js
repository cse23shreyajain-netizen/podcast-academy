"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getAdminCourse, updateCourseContent } from "../../../../../services/adminService";
import Button from "../../../../../components/ui/Button";
import Alert from "../../../../../components/ui/Alert";

const encode = (value) => JSON.stringify(value ?? null, null, 2);

export default function CourseContentPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState("");
  const [assessment, setAssessment] = useState("");
  const [project, setProject] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    getAdminCourse(id)
      .then((res) => {
        if (!active) return;
        const loaded = res.data.course;
        setCourse(loaded);
        setModules(encode(loaded.modules || []));
        setAssessment(encode(loaded.finalAssessment || { instructions: "", questions: [] }));
        setProject(encode(loaded.practicalProject || {}));
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const save = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    let content;
    try {
      content = {
        modules: JSON.parse(modules),
        finalAssessment: JSON.parse(assessment),
        practicalProject: JSON.parse(project),
      };
    } catch (parseError) {
      setError(`Content must be valid JSON: ${parseError.message}`);
      return;
    }

    setSaving(true);
    try {
      const res = await updateCourseContent(id, content);
      setCourse(res.data.course);
      setModules(encode(res.data.course.modules));
      setAssessment(encode(res.data.course.finalAssessment));
      setProject(encode(res.data.course.practicalProject));
      setMessage("Course learning content saved.");
    } catch (saveError) {
      const validation = saveError.errors?.map((item) => item.message).join(", ");
      setError(validation || saveError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted">Loading course content...</p>;
  if (!course) return <Alert>{error || "Course not found."}</Alert>;

  const editorClass = "min-h-72 w-full rounded-lg border border-ink/20 bg-white p-3 font-mono text-xs leading-5 outline-none focus:border-amber";

  return (
    <div>
      <Link href="/admin/courses" className="text-sm text-muted hover:underline">← All courses</Link>
      <h1 className="mt-3 font-display text-3xl font-bold">Learning content</h1>
      <p className="mt-1 text-muted">{course.title}</p>
      <p className="mt-3 rounded-lg bg-amber/10 p-3 text-sm text-ink">
        Edit structured course content as JSON. Module and lesson IDs must remain stable so existing student progress continues to match. Correct answers are private to students until assessment submission.
      </p>

      <form onSubmit={save} className="mt-6 space-y-5">
        <div>
          <label htmlFor="modules" className="mb-2 block font-semibold">Modules and lessons</label>
          <textarea id="modules" value={modules} onChange={(event) => setModules(event.target.value)} className={editorClass} spellCheck="false" />
        </div>
        <div>
          <label htmlFor="assessment" className="mb-2 block font-semibold">Final assessment</label>
          <textarea id="assessment" value={assessment} onChange={(event) => setAssessment(event.target.value)} className={editorClass} spellCheck="false" />
        </div>
        <div>
          <label htmlFor="project" className="mb-2 block font-semibold">Practical project</label>
          <textarea id="project" value={project} onChange={(event) => setProject(event.target.value)} className={`${editorClass} min-h-48`} spellCheck="false" />
        </div>
        {error && <Alert>{error}</Alert>}
        {message && <Alert type="success">{message}</Alert>}
        <Button type="submit" loading={saving}>Save learning content</Button>
      </form>
    </div>
  );
}
