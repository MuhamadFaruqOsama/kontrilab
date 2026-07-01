export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-ktr-neutral-1000 text-foreground sm:py-6">
      <div className="ktr-app-shell mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-background sm:rounded-[32px]">
        {children}
      </div>
    </div>
  );
}
