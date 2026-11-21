"use client";

import { useEffect, useState } from "react";
import { getCourses, getCategories } from "../../services/courseService";
import CourseCard from "./CourseCard";
import Alert from "../ui/Alert";
import Pagination from "../ui/Pagination";

const LIMIT = 6;
const levels = ["beginner", "intermediate", "advanced"];

export default function CourseCatalogue() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ courses: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.categories))
      .catch(() => {});
  }, []);

  // Search: typing rukne ke 400ms baad hi API call
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    getCourses({ search: debouncedSearch, category, level, page, limit: LIMIT })
      .then((res) => { if (!ignore) setData(res.data); })
      .catch((err) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [debouncedSearch, category, level, page]);

  const changeCategory = (slug) => { setCategory(slug); setPage(1); };
  const changeLevel = (e) => { setLevel(e.target.value); setPage(1); };
  const clearFilters = () => { setSearch(""); setCategory(""); setLevel(""); setPage(1); };

  const chip = (active) =>
    `rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
      active ? "border-ink bg-ink text-paper" : "border-ink/20 hover:border-ink"
    }`;

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="search"
          aria-label="Search courses"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-ink/20 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-amber"
        />
        <select
          aria-label="Filter by level"
          value={level}
          onChange={changeLevel}
          className="rounded-lg border border-ink/20 bg-white px-3.5 py-2.5 text-sm capitalize outline-none focus:border-amber md:w-48"
        >
          <option value="">All levels</option>
          {levels.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => changeCategory("")} className={chip(category === "")}>All</button>
        {categories.map((c) => (
          <button key={c._id} onClick={() => changeCategory(c.slug)} className={chip(category === c.slug)}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {error && <Alert>{error}</Alert>}

        {loading ? (
          <p className="py-16 text-center text-muted">Loading courses...</p>
        ) : data.courses.length === 0 && !error ? (
          <div className="py-16 text-center">
            <p className="text-muted">No courses found.</p>
            <button onClick={clearFilters} className="mt-3 text-sm font-semibold underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.courses.map((c) => (
              <CourseCard key={c._id} course={c} />
            ))}
          </div>
        )}

        <Pagination page={page} pages={data.pagination?.pages} onChange={setPage} />
      </div>
    </div>
  );
}