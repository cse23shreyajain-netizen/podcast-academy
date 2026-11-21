"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getStudents, setUserStatus } from "../../../services/adminService";
import useDebounce from "../../../hooks/useDebounce";
import DataTable from "../../../components/ui/DataTable";
import Pagination from "../../../components/ui/Pagination";
import Alert from "../../../components/ui/Alert";

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search.trim());
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ users: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await getStudents({ search: debounced, page, limit: 10 });
      setData(res.data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debounced, page]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleStatus = async (u) => {
    const next = u.status === "active" ? "inactive" : "active";
    try {
      await setUserStatus(u._id, next);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "status", label: "Status",
      render: (u) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${u.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {u.status}
        </span>
      ),
    },
    { key: "createdAt", label: "Joined", render: (u) => new Date(u.createdAt).toLocaleDateString("en-GB") },
    {
      key: "actions", label: "Actions",
      render: (u) => (
        <div className="flex gap-4">
          <Link href={`/admin/students/${u._id}`} className="font-semibold underline">View</Link>
          <button onClick={() => toggleStatus(u)} className="font-semibold text-amber-dark hover:underline">
            {u.status === "active" ? "Deactivate" : "Activate"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Students</h1>

      <input
        type="search"
        aria-label="Search students"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="mt-6 w-full max-w-md rounded-lg border border-ink/20 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-amber"
      />

      <div className="mt-4">
        {error && <Alert>{error}</Alert>}
        {loading ? <p className="text-muted">Loading...</p> : <DataTable columns={columns} rows={data.users} empty="No students found." />}
        <Pagination page={page} pages={data.pagination?.pages} onChange={setPage} />
      </div>
    </div>
  );
}