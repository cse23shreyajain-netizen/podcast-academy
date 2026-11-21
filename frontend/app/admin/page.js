import CourseCatalogue from "../../components/courses/CourseCatalogue";

export const metadata = { title: "Courses | Podcast Academy" };

export default function CoursesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-display text-4xl font-bold">Courses</h1>
      <p className="mt-3 max-w-xl text-muted">
        Browse our training programs by area and level.
      </p>
      <div className="mt-8">
        <CourseCatalogue />
      </div>
    </div>
  );
}