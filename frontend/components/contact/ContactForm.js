"use client";

import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import { submitContact } from "../../services/contactService";

const empty = { name: "", email: "", subject: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.subject.trim().length < 3) e.subject = "Subject must be at least 3 characters";
    if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    try {
      const res = await submitContact(form);
      setStatus({ type: "success", text: res.message });
      setForm(empty);
    } catch (err) {
      const fieldErrors = {};
      err.errors?.forEach((x) => { fieldErrors[x.field] = x.message; });
      setErrors(fieldErrors);
      if (!err.errors?.length) setStatus({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Alert type={status.type || "error"}>{status.text}</Alert>
      <Input label="Name" id="name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
      <Input label="Email" id="email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
      <Input label="Subject" id="subject" name="subject" value={form.subject} onChange={handleChange} error={errors.subject} />
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">Message</label>
        <textarea
          id="message" name="message" rows={5}
          value={form.message} onChange={handleChange}
          aria-invalid={!!errors.message}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm outline-none focus:border-amber ${errors.message ? "border-red-500" : "border-ink/20"}`}
        />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
      </div>
      <Button type="submit" loading={submitting}>Send message</Button>
    </form>
  );
}