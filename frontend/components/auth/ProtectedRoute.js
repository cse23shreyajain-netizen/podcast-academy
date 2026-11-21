"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const allowed = !!user && (!roles || roles.includes(user.role));

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (!allowed) router.replace(user.role === "admin" ? "/admin" : "/");
  }, [loading, user, allowed, router]);

  if (loading || !allowed) {
    return <p className="py-20 text-center text-muted">Loading...</p>;
  }
  return children;
}