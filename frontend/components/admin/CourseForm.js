"use client";

import { useEffect, useState } from "react";
import { getCategories } from "../../services/courseService";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const emptyCurriculum = { title: "", description: "" };

const emptyForm = {
  title: "", shortDescription: "", description: "", category: "",
  level: "beginner", duration: "", image: "", status: "draft",
  outcomes: "", curriculum: [{ ...emptyCurriculum }],
};

// Backend ke course object ko form state mein badalta hai (edit page ke liye)
export const courseToForm = (c) => ({
  title: c.title,
  shortDescription: c.shortDescription,
  description: c.description,
  category: c.category?._id || c.category || "",
  level: c.level,
  duration: c.duration,
  image: c.image || "",
  status: c.status,
  outcomes: (c.learningOutcomes || []).join("\n"),
  curriculum: c.curriculumOverview?.length
    ? c.curriculumOverview.map((i) => ({ title: i.title, description: i.description || "" }))
    : [{ ...emptyCurriculum }],
});

const fieldClass =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-amber";

export default function CourseForm({ initial, onSubmit, submitLabel }) {
  const [form, setForm] = useState(initial || emptyForm);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.categories))
      .catch(() => {});
  }, []);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const setCurr = (i, field, value) =>
    setForm({
      ...form,
      curriculum: form.curriculum.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)),
    });
  const addCurr = () => setForm({ ...form, curriculum: [...form.curriculum, { ...emptyCurriculum }] });
  const removeCurr = (i) =>
    setForm({ ...form, curriculum: form.curriculum.filter((_, idx) => idx !== i) });

  const validate = () => {
    const e = {};
    if (form.title.trim().length < 3) e.title = "Title must be at least 3 characters";
    const sd = form.shortDescription.trim().length;
    if (sd < 10 || sd > 200) e.shortDescription = "Short description must be 10-200 characters";
    if (form.description.trim().length < 20) e.description = "Description must be at least 20 characters";
    if (!form.category) e.category = "Select a category";
    if (!form.duration.trim()) e.duration = "Duration is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    const payload = {
      title: form.title.trim(),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      category: form.category,
      level: form.level,
      duration: form.duration.trim(),
      image: form.image.trim(),
      status: form.status,
      learningOutcomes: form.outcomes.split("\n").map((s) => s.trim()).filter(Boolean),
      curriculumOverview: form.curriculum
        .filter((c) => c.title.trim())
        .map((c) => ({ title: c.title.trim(), description: c.description.trim() })),
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setFormError(err.errors?.length ? err.errors.map((x) => x.message).join(", ") : err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Alert>{formError}</Alert>

      <Input label="Title" id="title" name="title" value={form.title} onChange={set} error={errors.title} />

      <div>
        <label htmlFor="shortDescription" className="mb-1.5 block text-sm font-medium">Short description</label>
        <input id="shortDescription" name="shortDescription" value={form.shortDescription} onChange={set}
          className={`${fieldClass} ${errors.shortDescription ? "border-red-500" : "border-ink/20"}`} />
        {errors.shortDescription && <p className="mt-1 text-sm text-red-600">{errors.shortDescription}</p>}
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium">Full description</label>
        <textarea id="description" name="description" rows={5} value={form.description} onChange={set}
          className={`${fieldClass} ${errors.description ? "border-red-500" : "border-ink/20"}`} />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium">Category</label>
          <select id="category" name="category" value={form.category} onChange={set}
            className={`${fieldClass} ${errors.category ? "border-red-500" : "border-ink/20"}`}>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="level" className="mb-1.5 block text-sm font-medium">Level</label>
          <select id="level" name="level" value={form.level} onChange={set} className={`${fieldClass} border-ink/20 capitalize`}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <Input label="Duration (e.g. 4 weeks)" id="duration" name="duration" value={form.duration} onChange={set} error={errors.duration} />

        <div>
          <label htmlFor="status" className="mb-1.5 block text-sm font-medium">Status</label>
          <select id="status" name="status" value={form.status} onChange={set} className={`${fieldClass} border-ink/20`}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <Input label="Image URL (optional)" id="image" name="image" value={form.image} onChange={set} />

      <div>
        <label htmlFor="outcomes" className="mb-1.5 block text-sm font-medium">Learning outcomes (one per line)</label>
        <textarea id="outcomes" name="outcomes" rows={4} value={form.outcomes} onChange={set}
          className={`${fieldClass} border-ink/20`} />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Curriculum overview</legend>
        <div className="space-y-3">
          {form.curriculum.map((c, i) => (
            <div key={i} className="rounded-lg border border-ink/10 bg-white p-3">
              <input aria-label={`Curriculum item ${i + 1} title`} placeholder="Title" value={c.title}
                onChange={(e) => setCurr(i, "title", e.target.value)} className={`${fieldClass} border-ink/20`} />
              <input aria-label={`Curriculum item ${i + 1} description`} placeholder="Description (optional)" value={c.description}
                onChange={(e) => setCurr(i, "description", e.target.value)} className={`${fieldClass} mt-2 border-ink/20`} />
              {form.curriculum.length > 1 && (
                <button type="button" onClick={() => removeCurr(i)} className="mt-2 text-xs font-semibold text-red-600">
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addCurr} className="mt-3 text-sm font-semibold underline">
          + Add item
        </button>
      </fieldset>

      <Button type="submit" loading={submitting}>{submitLabel}</Button>
    </form>
  );
}