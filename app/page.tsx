import Link from "next/link";
import { ArrowRight, ClipboardCheck, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-10 px-6 py-12 sm:px-8">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-medium text-muted-foreground">
            Kontrilab platform setup
          </p>
          <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">
            Evaluate each student&apos;s contribution with a mobile-first
            workflow.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            The base stack is ready for a Next.js App Router interface,
            shadcn/radix-nova components, Tailwind CSS v4 tokens, Socket.IO
            collaboration events, and Supabase-backed project data.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/login">
                Masuk
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/register">Daftar</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-card p-5 text-card-foreground">
            <UsersRound
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
            <h2 className="mt-4 text-lg font-medium">Role-aware evaluations</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Prepare student, lecturer, and admin experiences without changing
              the current route-group structure.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5 text-card-foreground">
            <ClipboardCheck
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
            <h2 className="mt-4 text-lg font-medium">Contribution evidence</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Keep future peer reviews, rubrics, and project activity in one
              consistent mobile app surface.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
