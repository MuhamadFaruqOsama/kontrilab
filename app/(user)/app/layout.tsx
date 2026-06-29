export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-slate-950 text-white">{children}</div>;
}
