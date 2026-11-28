"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getInstructors, createInstructor, updateInstructor, setUserStatus,
} from "../../../services/adminService";
import DataTable from "../../../components/ui/DataTable";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";

const empty = { name: "", email: "", password: "" };

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await getInstructors({ limit: 50 });
      setInstructors(res.data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getInstructors({ limit: 50 })
      .then((res) => {
        if (active) setInstructors(res.data.users);
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
  }, []);

  const reset = () => { setForm(empty); setEditingId(null); };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (form.name.trim().length < 2) return setError("Name must be at least 2 characters");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email");
    if (!editingId) {
      if (form.password.length < 8) return setError("Password must be at least 8 characters");
      if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password))
        return setError("Password needs a letter and a number");
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateInstructor(editingId, { name: form.name.trim(), email: form.email.trim() });
      } else {
        await createInstructor({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      }
      setMessage(editingId ? "Instructor updated." : "Instructor created.");
      reset();
      await load();
    } catch (err) {
      setError(err.errors?.[0]?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (u) => {
    setEditingId(u._id);
    setForm({ name: u.name, email: u.email, password: "" });
    setMessage("");
    setError("");
  };

  const toggleStatus = async (u) => {
    setError("");
    try {
      await setUserStatus(u._id, u.status === "active" ? "inactive" : "active");
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status", render: (u) => (
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${u.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
        {u.status}
      </span>
    ) },
    { key: "actions", label: "Actions", render: (u) => (
      <div className="flex gap-3 text-sm font-semibold">
        <button onClick={() => startEdit(u)} className="underline">Edit</button>
        <button onClick={() => toggleStatus(u)} className="text-amber-dark hover:underline">
          {u.status === "active" ? "Deactivate" : "Activate"}
        </button>
      </div>
    ) },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Instructors</h1>

      <form onSubmit={submit} noValidate className="mt-6 space-y-4 rounded-xl border border-ink/10 bg-white p-5">
        <h2 className="font-display text-lg font-semibold">{editingId ? "Edit instructor" : "New instructor account"}</h2>
        <Input label="Name" id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Email" id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        {!editingId && (
          <Input label="Temporary password" id="password" type="password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" />
        )}
        <div className="flex gap-3">
          <Button type="submit" loading={saving}>{editingId ? "Save changes" : "Create instructor"}</Button>
          {editingId && <Button type="button" variant="ghost" onClick={reset}>Cancel</Button>}
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {error && <Alert>{error}</Alert>}
        {message && <Alert type="success">{message}</Alert>}
        {loading ? <p className="text-muted">Loading...</p> : <DataTable columns={columns} rows={instructors} empty="No instructors yet." />}
      </div>
    </div>
  );
}