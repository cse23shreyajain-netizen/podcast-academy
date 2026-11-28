"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  completeLesson,
  getLearningContent,
  submitAssessment,
  submitProject,
} from "../../services/enrollmentService";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import ProgressBar from "../ui/ProgressBar";

export default function CourseLearning({ enrollmentId }) {
  const [data, setData] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [assessmentId, setAssessmentId] = useState("");
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [projectResponse, setProjectResponse] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    getLearningContent(enrollmentId)
      .then((res) => {
        if (active) {
          setData(res.data);
          setProjectResponse(res.data.enrollment.projectSubmission?.response || "");
          setProjectUrl(res.data.enrollment.projectSubmission?.resourceUrl || "");
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [enrollmentId]);

  const lessons = useMemo(
    () => data?.course.modules.flatMap((courseModule) =>
      courseModule.lessons.map((lesson) => ({ ...lesson, moduleId: courseModule.id, moduleTitle: courseModule.title }))
    ) || [],
    [data]
  );
  const completed = data?.enrollment.completedLessonIds || [];
  const resumeLesson = () => {
    const lastIndex = lessons.findIndex((lesson) => lesson.id === data?.enrollment.lastLessonId);
    if (lastIndex >= 0 && completed.includes(lessons[lastIndex].id)) {
      return lessons.slice(lastIndex + 1).find((lesson) => !completed.includes(lesson.id)) || lessons[lastIndex];
    }
    return lessons.find((lesson) => !completed.includes(lesson.id)) || lessons[0];
  };
  const currentLesson = lessons.find((lesson) => lesson.id === selectedLessonId) || resumeLesson();
  const currentModule = data?.course.modules.find((item) => item.id === currentLesson?.moduleId);
  const questions = assessmentId === "final"
    ? data?.course.finalAssessment.questions || []
    : data?.course.modules.find((item) => item.id === assessmentId)?.questions || [];

  const openAssessment = (id) => {
    setAssessmentId(id);
    setAnswers({});
    setResult(null);
    setError("");
    setMessage("");
  };

  const markComplete = async () => {
    if (!currentLesson) return;
    setBusy(true);
    setError("");
    try {
      const res = await completeLesson(enrollmentId, currentLesson.id);
      setData((current) => ({ ...current, enrollment: res.data.enrollment }));
      setMessage("Lesson marked complete.");
      const next = lessons.find((lesson) => !res.data.enrollment.completedLessonIds.includes(lesson.id));
      if (next) setSelectedLessonId(next.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const sendAssessment = async (event) => {
    event.preventDefault();
    if (questions.some((question) => answers[question.id] === undefined)) {
      setError("Answer every question before submitting.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const submission = questions.map((question) => ({
        questionId: question.id,
        selectedAnswer: Number(answers[question.id]),
      }));
      const res = await submitAssessment(enrollmentId, assessmentId, submission);
      setResult(res.data);
      setData((current) => ({
        ...current,
        enrollment: {
          ...current.enrollment,
          quizAttempts: [...(current.enrollment.quizAttempts || []), res.data.attempt],
        },
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const saveProject = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const res = await submitProject(enrollmentId, { response: projectResponse, resourceUrl: projectUrl });
      setData((current) => ({
        ...current,
        enrollment: { ...current.enrollment, projectSubmission: res.data.projectSubmission },
      }));
      setMessage("Project submission saved.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="py-12 text-center text-muted">Loading course lessons...</p>;
  if (!data) {
    return (
      <div className="mx-auto max-w-3xl py-10">
        <Alert>{error || "Learning content is unavailable."}</Alert>
        <Link href="/dashboard/courses" className="mt-4 inline-block text-sm font-semibold underline">Back to my courses</Link>
      </div>
    );
  }

  const { course, enrollment } = data;
  const finalFeedback = (items) => items.map((item) => {
    const question = questions.find((entry) => entry.id === item.questionId);
    return (
      <li key={item.questionId} className="rounded-lg border border-ink/10 p-3">
        <p className="font-medium">{question?.prompt}</p>
        <p className={item.correct ? "mt-1 text-sm text-green-700" : "mt-1 text-sm text-red-700"}>
          {item.correct ? "Correct" : `Review: ${question?.options[item.correctAnswer]}`}
        </p>
        <p className="mt-1 text-sm text-muted">{item.explanation}</p>
      </li>
    );
  });

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/dashboard/courses" className="text-sm text-muted hover:underline">← My courses</Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-dark">{course.category?.name}</p>
          <h1 className="mt-1 font-display text-3xl font-bold">{course.title}</h1>
        </div>
        <div className="w-full max-w-xs">
          <div className="mb-1 flex justify-between text-xs">
            <span>Course progress</span><span>{enrollment.progress}%</span>
          </div>
          <ProgressBar value={enrollment.progress} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <main className="min-w-0">
          {error && <div className="mb-4"><Alert>{error}</Alert></div>}
          {message && <div className="mb-4"><Alert type="success">{message}</Alert></div>}

          {assessmentId ? (
            <section className="rounded-xl border border-ink/10 bg-white p-5 sm:p-7">
              <button onClick={() => setAssessmentId("")} className="text-sm font-semibold underline">← Back to lesson</button>
              <h2 className="mt-4 font-display text-2xl font-bold">
                {assessmentId === "final" ? "Final course assessment" : "Module knowledge check"}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {assessmentId === "final" ? course.finalAssessment.instructions : "Choose the best answer for every question. Correct answers and explanations appear after submission."}
              </p>
              <form onSubmit={sendAssessment} className="mt-5 space-y-5">
                {questions.map((question, index) => (
                  <fieldset key={question.id} className="rounded-lg border border-ink/10 p-4">
                    <legend className="px-1 font-semibold">{index + 1}. {question.prompt}</legend>
                    <div className="mt-3 space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <label key={`${question.id}-${optionIndex}`} className="flex cursor-pointer items-start gap-2 text-sm">
                          <input
                            type="radio"
                            name={question.id}
                            value={optionIndex}
                            checked={Number(answers[question.id]) === optionIndex}
                            onChange={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
                <Button type="submit" loading={busy} disabled={Boolean(result)}>Submit assessment</Button>
              </form>
              {result && (
                <div className="mt-6">
                  <p className="font-semibold">Score: {result.score}%</p>
                  <ul className="mt-3 space-y-3">{finalFeedback(result.feedback)}</ul>
                </div>
              )}
            </section>
          ) : !currentLesson ? (
            <div className="rounded-xl border border-dashed border-ink/20 bg-white p-8 text-center text-muted">
              This course has no lessons yet.
            </div>
          ) : (
            <article className="rounded-xl border border-ink/10 bg-white p-5 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-dark">{currentLesson.moduleTitle}</p>
              <h2 className="mt-2 font-display text-2xl font-bold">{currentLesson.title}</h2>

              <section className="mt-6">
                <h3 className="font-semibold">Learning objectives</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
                  {currentLesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}
                </ul>
              </section>

              <section className="mt-6">
                <h3 className="font-semibold">Lesson</h3>
                <p className="mt-2 whitespace-pre-line leading-7 text-muted">{currentLesson.explanation}</p>
              </section>

              <section className="mt-6 rounded-lg bg-paper p-4">
                <h3 className="font-semibold">Podcast production example</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{currentLesson.example}</p>
              </section>

              <section className="mt-6">
                <h3 className="font-semibold">Practical demonstration</h3>
                <ol className="mt-2 list-inside list-decimal space-y-2 text-sm leading-6 text-muted">
                  {currentLesson.demonstration.map((step) => <li key={step}>{step}</li>)}
                </ol>
              </section>

              <section className="mt-6">
                <h3 className="font-semibold">Key terminology</h3>
                <dl className="mt-2 space-y-2">
                  {currentLesson.terminology.map((item) => (
                    <div key={item.term} className="text-sm">
                      <dt className="inline font-medium">{item.term}: </dt>
                      <dd className="inline text-muted">{item.definition}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="mt-6">
                <h3 className="font-semibold">Common mistakes</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
                  {currentLesson.commonMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}
                </ul>
              </section>

              <section className="mt-6">
                <h3 className="font-semibold">Key takeaways</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
                  {currentLesson.keyTakeaways.map((takeaway) => <li key={takeaway}>{takeaway}</li>)}
                </ul>
              </section>

              <section className="mt-6 rounded-lg border border-amber/40 p-4">
                <h3 className="font-semibold">Practice exercise</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{currentLesson.exercise}</p>
              </section>

              <div className="mt-6 flex flex-wrap gap-3">
                {currentModule.questions.length > 0 && (
                  <Button variant="secondary" onClick={() => openAssessment(currentModule.id)}>Module knowledge check</Button>
                )}
                <Button onClick={markComplete} loading={busy} disabled={completed.includes(currentLesson.id)}>
                  {completed.includes(currentLesson.id) ? "Lesson completed" : "Mark lesson complete"}
                </Button>
              </div>
            </article>
          )}

          {!assessmentId && course.finalAssessment.questions.length > 0 && (
            <section className="mt-5 rounded-xl border border-ink/10 bg-white p-5">
              <h2 className="font-display text-xl font-semibold">Final assessment</h2>
              <p className="mt-1 text-sm text-muted">{course.finalAssessment.instructions}</p>
              <Button className="mt-4" onClick={() => openAssessment("final")}>Start final assessment</Button>
            </section>
          )}

          {!assessmentId && course.practicalProject && (
            <section className="mt-5 rounded-xl border border-ink/10 bg-white p-5">
              <h2 className="font-display text-xl font-semibold">{course.practicalProject.title}</h2>
              <p className="mt-2 leading-6 text-muted">{course.practicalProject.instructions}</p>
              <p className="mt-3 text-sm"><span className="font-semibold">Submission format: </span>{course.practicalProject.submissionFormat}</p>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted">
                {course.practicalProject.criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}
              </ul>
              <form onSubmit={saveProject} className="mt-5 space-y-3">
                <label htmlFor="project-response" className="block text-sm font-semibold">Written response or project notes</label>
                <textarea id="project-response" maxLength={10000} rows={5} value={projectResponse} onChange={(event) => setProjectResponse(event.target.value)} className="w-full rounded-lg border border-ink/20 bg-white p-3 text-sm outline-none focus:border-amber" />
                <label htmlFor="project-url" className="block text-sm font-semibold">Optional project link</label>
                <input id="project-url" type="url" value={projectUrl} onChange={(event) => setProjectUrl(event.target.value)} className="w-full rounded-lg border border-ink/20 bg-white p-3 text-sm outline-none focus:border-amber" />
                {enrollment.projectSubmission?.submittedAt && <p className="text-xs text-muted">Last saved {new Date(enrollment.projectSubmission.submittedAt).toLocaleString()}</p>}
                <Button type="submit" loading={busy}>Save project submission</Button>
              </form>
            </section>
          )}
        </main>

        <aside className="h-fit rounded-xl border border-ink/10 bg-white p-4">
          <h2 className="font-display text-lg font-semibold">Course lessons</h2>
          <div className="mt-3 space-y-4">
            {course.modules.map((courseModule, index) => (
              <section key={courseModule.id}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{index + 1}. {courseModule.title}</h3>
                <div className="mt-2 space-y-1">
                  {courseModule.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => { setSelectedLessonId(lesson.id); setAssessmentId(""); setError(""); setMessage(""); }}
                      className={`w-full rounded-md px-2 py-2 text-left text-sm ${currentLesson?.id === lesson.id && !assessmentId ? "bg-ink text-paper" : "hover:bg-ink/5"}`}
                    >
                      <span className="mr-2" aria-label={completed.includes(lesson.id) ? "Completed" : "Not completed"}>
                        {completed.includes(lesson.id) ? "✓" : "○"}
                      </span>
                      {lesson.title}
                    </button>
                  ))}
                </div>
                {courseModule.questions.length > 0 && (
                  <button className="mt-2 text-xs font-semibold text-amber-dark underline" onClick={() => openAssessment(courseModule.id)}>
                    Knowledge check
                  </button>
                )}
              </section>
            ))}
          </div>
          {enrollment.quizAttempts?.length > 0 && (
            <div className="mt-5 border-t border-ink/10 pt-4">
              <h3 className="text-sm font-semibold">Assessment attempts</h3>
              <ul className="mt-2 space-y-1 text-xs text-muted">
                {enrollment.quizAttempts.map((attempt, index) => (
                  <li key={`${attempt.assessmentId}-${attempt.submittedAt}-${index}`}>
                    {attempt.assessmentId === "final" ? "Final" : "Module"}: {attempt.score}%
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
