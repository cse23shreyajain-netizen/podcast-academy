"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import CourseForm, { courseToForm } from "../../../../../components/admin/CourseForm";
import { getAdminCourse, updateCourse } from "../../../../../services/adminService";
import Alert from "../../../../../components/ui/Alert";

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();
  const [initial, setInitial] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminCourse(id)
      .then((res) => setInitial(courseToForm(res.data.course)))
      .catch((err) => setError(err.status === 404 ? "Course not found." : err.message));
  }, [id]);

  const handleSubmit = async (payload) => {
    await updateCourse(id, payload);
    router.push("/admin/courses");
  };

  return (
    <div className="max-w-3xl">
      <Link href="/admin/courses" className="text-sm text-muted hover:underline">← All courses</Link>
      <h1 className="mb-6 mt-3 font-display text-3xl font-bold">Edit course</h1>
      {error ? <Alert>{error}</Alert> : !initial ? <p className="text-muted">Loading...</p> : (
        <CourseForm initial={initial} onSubmit={handleSubmit} submitLabel="Save changes" />
      )}
    </div>
  );
}