"use client";

import { useEffect, useState } from "react";
import { getAdminEnrollments, getAdminCourses } from "../../../services/adminService";
import useDebounce from "../../../hooks/useDebounce";
import DataTable from "../../../components/ui/DataTable";
import Pagination from "../../../components/ui/Pagination";
import Alert from "../../../components/ui/Alert";

export default function AdminEnrollmentsPage() {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search.trim());
  const [course, setCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ enrollments: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminCourses({ limit: 50 })
      .then((res) => setCourses(res.data.courses))
      .catch(() => {});
  }, []);

  useEffect(() => {
    getAdminEnrollments({ search: debounced, course, page, limit: 10 })
      .then((res) => { setData(res.data); setError(""); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [debounced, course, page]);

  const columns = [
    { key: "student", label: "Student", render: (e) => (
      <span><span className="font-medium">{e.student?.name}</span><br /><span className="text-xs text-muted">{e.student?.email}</span></span>
    ) },
    { key: "course", label: "Course", render: (e) => e.course?.title },
    { key: "status", label: "Status", render: (e) => <span className="capitalize">{e.status}</span> },
    { key: "progress", label: "Progress", render: (e) => `${e.progress}%` },
    { key: "enrolledAt", label: "Enrolled", render: (e) => new Date(e.enrolledAt).toLocaleDateString("en-GB") },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Enrolments</h1>

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <input
          type="search" aria-label="Search by student" placeholder="Search by student name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full rounded-lg border border-ink/20 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-amber"
        />
        <select
          aria-label="Filter by course" value={course}
          onChange={(e) => { setCourse(e.target.value); setPage(1); }}
          className="rounded-lg border border-ink/20 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-amber md:w-64"
        >
          <option value="">All courses</option>
          {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
      </div>

      <div className="mt-4">
        {error && <Alert>{error}</Alert>}
        {loading ? <p className="text-muted">Loading...</p> : <DataTable columns={columns} rows={data.enrollments} empty="No enrolments found." />}
        <Pagination page={page} pages={data.pagination?.pages} onChange={setPage} />
      </div>
    </div>
  );
}