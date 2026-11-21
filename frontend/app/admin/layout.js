import ProtectedRoute from "../../components/auth/ProtectedRoute";
import Sidebar from "../../components/dashboard/Sidebar";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/instructors", label: "Instructors" },
  { href: "/admin/enrollments", label: "Enrolments" },
];
export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute roles={["admin"]}>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row">
        <Sidebar items={items} label="Admin panel" />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </ProtectedRoute>
  );
}