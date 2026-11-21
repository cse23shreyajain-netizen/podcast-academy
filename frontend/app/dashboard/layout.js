import ProtectedRoute from "../../components/auth/ProtectedRoute";
import Sidebar from "../../components/dashboard/Sidebar";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/courses", label: "My Courses" },
  { href: "/dashboard/explore", label: "Explore Courses" },
  { href: "/dashboard/progress", label: "Learning Progress" },
  { href: "/dashboard/profile", label: "Profile & Settings" },
];

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute roles={["student"]}>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row">
        <Sidebar items={items} label="Student dashboard" />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </ProtectedRoute>
  );
}