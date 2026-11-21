"use client";

import { useCallback, useEffect, useState } from "react";
import { getMyEnrollments } from "../services/enrollmentService";

export default function useEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    try {
      const res = await getMyEnrollments();
      setEnrollments(res.data.enrollments.filter((e) => e.course));
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { enrollments, loading, error, reload };
}