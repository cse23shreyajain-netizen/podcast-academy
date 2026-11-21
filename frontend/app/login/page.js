"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const v = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) v.email = "Enter a valid email";
    if (!form.password) v.password = "Password is required";
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    try {
      const user = await login(form);
      router.push(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-display text-3xl font-bold">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">Login to continue learning.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        <Alert>{formError}</Alert>
        <Input label="Email" id="email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" />
        <Input label="Password" id="password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} autoComplete="current-password" />
        <Button type="submit" loading={submitting} className="w-full">Login</Button>
      </form>

      <p className="mt-6 text-center text-sm">
        New here?{" "}
        <Link href="/register" className="font-semibold underline">Create an account</Link>
      </p>
    </div>
  );
}