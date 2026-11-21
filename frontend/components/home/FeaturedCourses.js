"use client";

import { useEffect, useState } from "react";
import { getCourses } from "../../services/courseService";
import CourseCard from "../courses/CourseCard";
import Alert from "../ui/Alert";

export default function FeaturedCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCourses({ limit: 3 })
      .then((res) => setCourses(res.data.courses))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-muted">Loading courses...</p>;
  if (error) return <Alert>{error}</Alert>;
  if (courses.length === 0)
    return <p className="text-center text-muted">New courses are coming soon.</p>;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {courses.map((c) => (
        <CourseCard key={c._id} course={c} />
      ))}
    </div>
  );
}