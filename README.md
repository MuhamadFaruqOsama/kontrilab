# Kontrilab

Kontrilab is a mobile-first platform for evaluating each student's individual
contribution to group projects.

## Technology

The project is set up with the stack declared in `package.json` and
`components.json`:

- Next.js 16 App Router, React 19, and TypeScript
- Tailwind CSS v4 through `@tailwindcss/postcss`
- shadcn using the `radix-nova` style, React Server Components, CSS variables,
  and lucide icons
- Socket.IO on a custom Next.js server for real-time app events
- Zod, React Hook Form, and `@hookform/resolvers` for form validation
- Supabase project structure under `supabase/`
- Prisma ORM 7 with a PostgreSQL adapter and generated client under `lib/generated/prisma`

## Setup

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and fill in real values as services are
connected.

```bash
PORT=3000
HOST=localhost
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kontrilab?schema=public"
```

## Scripts

- `npm run dev` starts the custom Next.js and Socket.IO server.
- `npm run build` creates a production build.
- `npm run start` serves the production build with the custom server.
- `npm run lint` runs ESLint.
- `npm run prisma:generate` generates the Prisma client.
- `npm run prisma:migrate` creates and applies a development migration.
- `npm run db:push` pushes the Prisma schema without creating a migration.
- `npm run prisma:studio` opens Prisma Studio.
