"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const dashboardHref = user?.role === "admin" ? "/admin" : "/dashboard";

  const handleLogout = async () => {
    setLogoutError("");
    try {
      await logout();
      setOpen(false);
      router.push("/");
    } catch (err) {
      setLogoutError(err.message);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink text-paper">
      <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="font-display text-lg font-bold tracking-tight">
          Podcast<span className="text-amber">Academy</span>
        </Link>

        <ul className="hidden items-center gap-7 text-sm md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-paper/80 transition-colors hover:text-amber">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {!loading && (user ? (
            <>
              <Button href={dashboardHref} variant="primary">Dashboard</Button>
              <button onClick={handleLogout} className="text-sm text-paper/80 hover:text-amber">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-paper/80 hover:text-amber">Login</Link>
              <Button href="/register" variant="primary">Sign up</Button>
            </>
          ))}
        </div>

        <button
          className="md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {logoutError && (
        <p role="alert" className="mx-auto max-w-6xl px-4 pb-2 text-sm text-red-300">
          {logoutError}
        </p>
      )}

      {open && (
        <div className="border-t border-line px-4 pb-4 md:hidden">
          <ul className="flex flex-col gap-3 py-3 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
              </li>
            ))}
          </ul>
          {!loading && (user ? (
            <div className="flex flex-col gap-2">
              <Button href={dashboardHref} onClick={() => setOpen(false)}>Dashboard</Button>
              <button onClick={handleLogout} className="py-2 text-sm">Logout</button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button href="/login" variant="outline" className="!text-paper !border-paper" onClick={() => setOpen(false)}>Login</Button>
              <Button href="/register" onClick={() => setOpen(false)}>Sign up</Button>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}