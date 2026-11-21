"use client";

import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { updateProfile, changePassword } from "../../../services/userService";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  // Profile form
  const [name, setName] = useState(user.name);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const emptyPw = { currentPassword: "", newPassword: "", confirmPassword: "" };
  const [pw, setPw] = useState(emptyPw);
  const [pwErrors, setPwErrors] = useState({});
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });
  const [savingPw, setSavingPw] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: "", text: "" });
    if (name.trim().length < 2) return setProfileMsg({ type: "error", text: "Name must be at least 2 characters" });
    setSavingProfile(true);
    try {
      await updateProfile(name.trim());
      await refreshUser();
      setProfileMsg({ type: "success", text: "Profile updated." });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.errors?.[0]?.message || err.message });
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwMsg({ type: "", text: "" });
    const v = {};
    if (!pw.currentPassword) v.currentPassword = "Current password is required";
    if (pw.newPassword.length < 8) v.newPassword = "Password must be at least 8 characters";
    else if (!/[A-Za-z]/.test(pw.newPassword) || !/\d/.test(pw.newPassword))
      v.newPassword = "Password needs a letter and a number";
    if (pw.confirmPassword !== pw.newPassword) v.confirmPassword = "Passwords do not match";
    setPwErrors(v);
    if (Object.keys(v).length) return;

    setSavingPw(true);
    try {
      await changePassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      setPw(emptyPw);
      setPwMsg({ type: "success", text: "Password updated." });
    } catch (err) {
      setPwMsg({ type: "error", text: err.errors?.[0]?.message || err.message });
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl font-bold">Profile & Settings</h1>

      <section className="mt-6 rounded-xl border border-ink/10 bg-white p-6">
        <h2 className="font-display text-lg font-semibold">Profile</h2>
        <p className="mt-1 text-sm text-muted">{user.email} · {user.role}</p>
        <form onSubmit={saveProfile} noValidate className="mt-4 space-y-4">
          <Alert type={profileMsg.type || "error"}>{profileMsg.text}</Alert>
          <Input label="Full name" id="name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button type="submit" loading={savingProfile}>Save profile</Button>
        </form>
      </section>

      <section className="mt-6 rounded-xl border border-ink/10 bg-white p-6">
        <h2 className="font-display text-lg font-semibold">Change password</h2>
        <form onSubmit={savePassword} noValidate className="mt-4 space-y-4">
          <Alert type={pwMsg.type || "error"}>{pwMsg.text}</Alert>
          <Input label="Current password" id="currentPassword" type="password" value={pw.currentPassword}
            onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} error={pwErrors.currentPassword} autoComplete="current-password" />
          <Input label="New password" id="newPassword" type="password" value={pw.newPassword}
            onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} error={pwErrors.newPassword} autoComplete="new-password" />
          <Input label="Confirm new password" id="confirmPassword" type="password" value={pw.confirmPassword}
            onChange={(e) => setPw({ ...pw, confirmPassword: e.target.value })} error={pwErrors.confirmPassword} autoComplete="new-password" />
          <Button type="submit" loading={savingPw}>Update password</Button>
        </form>
      </section>
    </div>
  );
}