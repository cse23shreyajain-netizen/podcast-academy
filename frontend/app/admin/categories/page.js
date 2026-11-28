"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAdminCategories, createCategory, updateCategory, deleteCategory,
} from "../../../services/adminService";
import DataTable from "../../../components/ui/DataTable";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";

const empty = { name: "", description: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await getAdminCategories();
      setCategories(res.data.categories);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getAdminCategories()
      .then((res) => {
        if (active) setCategories(res.data.categories);
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

    setSaving(true);
    try {
      const body = { name: form.name.trim(), description: form.description.trim() };
      if (editingId) await updateCategory(editingId, body);
      else await createCategory(body);
      setMessage(editingId ? "Category updated." : "Category created.");
      reset();
      await load();
    } catch (err) {
      setError(err.errors?.[0]?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setForm({ name: c.name, description: c.description || "" });
    setMessage("");
    setError("");
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete "${c.name}"?`)) return;
    setError("");
    setMessage("");
    try {
      await deleteCategory(c._id);
      setMessage("Category deleted.");
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "slug", label: "Slug" },
    { key: "description", label: "Description" },
    { key: "actions", label: "Actions", render: (c) => (
      <div className="flex gap-3 text-sm font-semibold">
        <button onClick={() => startEdit(c)} className="underline">Edit</button>
        <button onClick={() => remove(c)} className="text-red-600 hover:underline">Delete</button>
      </div>
    ) },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Categories</h1>

      <form onSubmit={submit} noValidate className="mt-6 space-y-4 rounded-xl border border-ink/10 bg-white p-5">
        <h2 className="font-display text-lg font-semibold">{editingId ? "Edit category" : "New category"}</h2>
        <Input label="Name" id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Description (optional)" id="description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="flex gap-3">
          <Button type="submit" loading={saving}>{editingId ? "Save changes" : "Create category"}</Button>
          {editingId && <Button type="button" variant="ghost" onClick={reset}>Cancel</Button>}
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {error && <Alert>{error}</Alert>}
        {message && <Alert type="success">{message}</Alert>}
        {loading ? <p className="text-muted">Loading...</p> : <DataTable columns={columns} rows={categories} empty="No categories yet." />}
      </div>
    </div>
  );
}