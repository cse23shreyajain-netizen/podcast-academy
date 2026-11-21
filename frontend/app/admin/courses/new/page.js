"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import CourseForm from "../../../../components/admin/CourseForm";
import { createCourse } from "../../../../services/adminService";

export default function NewCoursePage() {
  const router = useRouter();

  const handleSubmit = async (payload) => {
    await createCourse(payload);
    router.push("/admin/courses");
  };

  return (
    <div className="max-w-3xl">
      <Link href="/admin/courses" className="text-sm text-muted hover:underline">← All courses</Link>
      <h1 className="mb-6 mt-3 font-display text-3xl font-bold">New course</h1>
      <CourseForm onSubmit={handleSubmit} submitLabel="Create course" />
    </div>
  );
}