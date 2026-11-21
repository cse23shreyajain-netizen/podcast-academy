"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getAdminCourses, setCourseStatus, deleteCourse } from "../../../services/adminService";
import useDebounce from "../../../hooks/useDebounce";
import DataTable from "../../../components/ui/DataTable";
import Pagination from "../../../components/ui/Pagination";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";

const badge = {
  published: "bg-green-100 text-green-700",
  draft: "bg-amber/20 text-amber-dark",
  archived: "bg-ink/10 text-muted",
};

export default function AdminCoursesPage() {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search.trim());
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ courses: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await getAdminCourses({ search: debounced, status, page, limit: 10 });
      setData(res.data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debounced, status, page]);

  useEffect(() => {
    load();
  }, [load]);

  const togglePublish = async (c) => {
    setMessage("");
    try {
      await setCourseStatus(c._id, c.status === "published" ? "draft" : "published");
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete "${c.title}"? If it has enrolments it will be archived instead.`)) return;
    setError("");
    try {
      const res = await deleteCourse(c._id);
      setMessage(res.message);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category", render: (c) => c.category?.name },
    { key: "level", label: "Level", render: (c) => <span className="capitalize">{c.level}</span> },
    { key: "status", label: "Status", render: (c) => (
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${badge[c.status]}`}>{c.status}</span>
    ) },
    { key: "actions", label: "Actions", render: (c) => (
      <div className="flex flex-wrap gap-3 text-sm font-semibold">
        <Link href={`/admin/courses/${c._id}/edit`} className="underline">Edit</Link>
        <button onClick={() => togglePublish(c)} className="text-amber-dark hover:underline">
          {c.status === "published" ? "Unpublish" : "Publish"}
        </button>
        <button onClick={() => remove(c)} className="text-red-600 hover:underline">Delete</button>
      </div>
    ) },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">Courses</h1>
        <Button href="/admin/courses/new">New course</Button>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <input type="search" aria-label="Search courses" placeholder="Search courses..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full rounded-lg border border-ink/20 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-amber" />
        <select aria-label="Filter by status" value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-lg border border-ink/20 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-amber md:w-48">
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="mt-4 space-y-3">
        {error && <Alert>{error}</Alert>}
        {message && <Alert type="success">{message}</Alert>}
        {loading ? <p className="text-muted">Loading...</p> : <DataTable columns={columns} rows={data.courses} empty="No courses found." />}
        <Pagination page={page} pages={data.pagination?.pages} onChange={setPage} />
      </div>
    </div>
  );
}

