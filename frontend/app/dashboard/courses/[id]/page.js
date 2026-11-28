"use client";

import { useParams } from "next/navigation";
import CourseLearning from "../../../../components/dashboard/CourseLearning";

export default function CourseLearningPage() {
  const { id } = useParams();
  return <CourseLearning enrollmentId={id} />;
}
