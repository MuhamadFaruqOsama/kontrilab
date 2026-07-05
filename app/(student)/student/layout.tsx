export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="ktr-app-shell mx-auto min-h-dvh w-full max-w-[430px] bg-background">
        {children}
      </div>
    </div>
  );
}
