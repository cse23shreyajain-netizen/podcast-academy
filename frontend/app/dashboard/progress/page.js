"use client";

import { useState } from "react";
import useEnrollments from "../../../hooks/useEnrollments";
import { updateProgress } from "../../../services/enrollmentService";
import ProgressBar from "../../../components/ui/ProgressBar";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";

function ProgressRow({ enrollment, onSaved }) {
  const [value, setValue] = useState(enrollment.progress);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await updateProgress(enrollment._id, Number(value));
      await onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="rounded-xl border border-ink/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold">{enrollment.course.title}</h3>
        <span className="text-sm font-semibold">{enrollment.progress}%</span>
      </div>
      <div className="mt-3"><ProgressBar value={enrollment.progress} /></div>

      <div className="mt-4 flex items-center gap-4">
        <input
          type="range" min="0" max="100" step="5"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label={`Set progress for ${enrollment.course.title}`}
          className="w-full accent-amber"
        />
        <span className="w-12 text-sm">{value}%</span>
        <Button onClick={save} loading={saving} className="!py-2">Save</Button>
      </div>
      {error && <div className="mt-3"><Alert>{error}</Alert></div>}
    </article>
  );
}

export default function ProgressPage() {
  const { enrollments, loading, error, reload } = useEnrollments();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Learning Progress</h1>
      <p className="mt-1 text-muted">Update your progress as you move through each course.</p>

      {error && <div className="mt-4"><Alert>{error}</Alert></div>}

      {loading ? (
        <p className="mt-8 text-muted">Loading...</p>
      ) : enrollments.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-ink/30 bg-white p-8 text-center text-muted">
          Enrol in a course to start tracking progress.
        </p>
      ) : (
        <div className="mt-6 grid gap-4">
          {enrollments.map((e) => (
            <ProgressRow key={e._id} enrollment={e} onSaved={reload} />
          ))}
        </div>
      )}
    </div>
  );
}