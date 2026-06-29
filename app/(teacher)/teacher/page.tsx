import { CalendarDays, ClipboardList, UsersRound } from "lucide-react";

const setupCards = [
  {
    title: "Assignments",
    description: "Prepare future homework, project tasks, and evaluation windows.",
    icon: ClipboardList,
  },
  {
    title: "Classes",
    description: "Keep teacher-owned class and group project management separate.",
    icon: UsersRound,
  },
  {
    title: "Schedules",
    description: "Reserve space for deadlines, project milestones, and reminders.",
    icon: CalendarDays,
  },
];

export default function TeacherPage() {
  return (
    <main className="flex-1 px-5 py-6 lg:px-8">
      <section className="max-w-6xl space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-medium leading-ktr-snug text-ktr-primary-hover">
            Desktop Website
          </p>
          <h2 className="text-3xl font-semibold leading-ktr-tight text-ktr-text-primary">
            Teacher tools will live in a wider workspace.
          </h2>
          <p className="text-base leading-ktr-relaxed text-ktr-text-secondary">
            This area is reserved for teachers to create assignments, manage project groups, monitor student progress, and review contribution evidence when the detailed flows are ready.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {setupCards.map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.title} className="rounded-lg border border-ktr-border-light bg-ktr-surface-card p-5">
                <span className="flex size-10 items-center justify-center rounded-lg bg-ktr-primary-soft text-ktr-primary-hover">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold leading-ktr-tight text-ktr-text-primary">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-ktr-normal text-ktr-text-secondary">
                  {card.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
