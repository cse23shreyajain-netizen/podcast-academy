import { Suspense } from "react";
import CourseDetail from "../../../components/courses/CourseDetail";

async function Content({ params }) {
  const { slug } = await params;
  return <CourseDetail slug={slug} />;
}

export default function CourseDetailPage({ params }) {
  return (
    <Suspense fallback={<p className="py-20 text-center text-muted">Loading course...</p>}>
      <Content params={params} />
    </Suspense>
  );
}