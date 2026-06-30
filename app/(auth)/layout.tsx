export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-ktr-neutral-1000 text-foreground sm:py-6">{children}</div>;
}
