"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ items, label = "Dashboard" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <aside className="md:w-56 md:shrink-0">
      <nav aria-label={label} className="flex gap-2 overflow-x-auto md:flex-col">
        {items.map((i) => {
          // "/dashboard" aur "/admin" sirf exact match pe active hon,
          // baaki (jaise /admin/students/123) apne parent link pe active dikhein
          const isRoot = i.href.split("/").length <= 2;
          const active = isRoot
            ? pathname === i.href
            : pathname === i.href || pathname.startsWith(`${i.href}/`);

          return (
            <Link
              key={i.href}
              href={i.href}
              aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-ink text-paper" : "hover:bg-ink/5"
              }`}
            >
              {i.label}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="whitespace-nowrap rounded-lg px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}