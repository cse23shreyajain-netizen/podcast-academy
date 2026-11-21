"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    else if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password))
      e.password = "Password needs a letter and a number";
    if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    try {
      await register(form);
      router.push("/dashboard");
    } catch (err) {
      const fieldErrors = {};
      err.errors?.forEach((x) => { fieldErrors[x.field] = x.message; });
      setErrors(fieldErrors);
      if (!err.errors?.length) setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-display text-3xl font-bold">Create your account</h1>
      <p className="mt-2 text-sm text-muted">Start learning podcast production today.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        <Alert>{formError}</Alert>
        <Input label="Full name" id="name" name="name" value={form.name} onChange={handleChange} error={errors.name} autoComplete="name" />
        <Input label="Email" id="email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" />
        <Input label="Password" id="password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} autoComplete="new-password" />
        <Input label="Confirm password" id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} autoComplete="new-password" />
        <Button type="submit" loading={submitting} className="w-full">Create account</Button>
      </form>

      <p className="mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold underline">Login</Link>
      </p>
    </div>
  );
}