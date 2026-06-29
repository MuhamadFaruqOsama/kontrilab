import Link from "next/link";
import { ArrowRight, MonitorCog, Smartphone, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-10 px-6 py-12 sm:px-8">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-medium text-muted-foreground">
            Kontrilab Platform Setup
          </p>
          <h1 className="text-4xl font-semibold tracking-ktr-ui sm:text-5xl">
            Separate teacher workspace and student mobile app foundations.
          </h1>
          <p className="max-w-2xl text-base leading-ktr-relaxed text-muted-foreground sm:text-lg">
            Kontrilab is prepared as two connected surfaces: teachers use a desktop website to assign and review project work, while students use a mobile-first app to join groups, submit updates, and follow project activity.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/teacher">
                Teacher Website
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/student">Student App</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/teacher" className="rounded-lg border bg-card p-5 text-card-foreground transition-colors hover:border-ktr-border-active">
            <MonitorCog
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
            <h2 className="mt-4 text-lg font-medium">Teacher Website</h2>
            <p className="mt-2 text-sm leading-ktr-normal text-muted-foreground">
              A desktop-first area for assignments, classes, project oversight, and contribution review.
            </p>
          </Link>
          <Link href="/student" className="rounded-lg border bg-card p-5 text-card-foreground transition-colors hover:border-ktr-border-active">
            <Smartphone
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
            <h2 className="mt-4 text-lg font-medium">Student App</h2>
            <p className="mt-2 text-sm leading-ktr-normal text-muted-foreground">
              A mobile-first area for group projects, contribution updates, activity, and profile access.
            </p>
          </Link>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-ktr-border-light bg-ktr-primary-soft px-4 py-3 text-sm leading-ktr-normal text-ktr-primary-dark">
          <UsersRound className="size-5 shrink-0" aria-hidden="true" />
          Both areas are setup scaffolds only. Screen details will follow the designs provided during development.
        </div>
      </section>
    </main>
  );
}
