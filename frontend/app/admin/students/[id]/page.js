"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getStudent } from "../../../../services/adminService";
import DataTable from "../../../../components/ui/DataTable";
import ProgressBar from "../../../../components/ui/ProgressBar";
import Alert from "../../../../components/ui/Alert";

export default function AdminStudentDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getStudent(id)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.status === 404 ? "Student not found." : err.message));
  }, [id]);

  if (error) return <Alert>{error}</Alert>;
  if (!data) return <p className="text-muted">Loading...</p>;

  const { student, enrollments } = data;

  const columns = [
    { key: "course", label: "Course", render: (e) => e.course?.title },
    { key: "status", label: "Status", render: (e) => <span className="capitalize">{e.status}</span> },
    {
      key: "progress", label: "Progress",
      render: (e) => (
        <div className="flex items-center gap-2">
          <div className="w-24"><ProgressBar value={e.progress} /></div>
          <span className="text-xs">{e.progress}%</span>
        </div>
      ),
    },
    { key: "enrolledAt", label: "Enrolled", render: (e) => new Date(e.enrolledAt).toLocaleDateString("en-GB") },
  ];

  return (
    <div>
      <Link href="/admin/students" className="text-sm text-muted hover:underline">← All students</Link>
      <h1 className="mt-3 font-display text-3xl font-bold">{student.name}</h1>
      <p className="mt-1 text-muted">
        {student.email} · <span className="capitalize">{student.status}</span> · Joined{" "}
        {new Date(student.createdAt).toLocaleDateString("en-GB")}
      </p>

      <h2 className="mb-3 mt-8 font-display text-xl font-semibold">Enrolments</h2>
      <DataTable columns={columns} rows={enrollments} empty="This student has no enrolments." />
    </div>
  );
}