import StudentHeader from "@/app/components/student/StudentHeader";
import ActiveProject from "@/app/components/student/ActiveProject";
import RecentActivities from "@/app/components/student/RecentActivities";
import QuickActions from "@/app/components/student/QuickActions";
import BottomNav from "@/app/components/student/BottomNav";

export default function StudentHomePage() {
  return (
    <main className="relative min-h-dvh bg-background pb-[220px] pt-6 text-ktr-text-primary">
      <div className="mx-auto flex w-full max-w-[430px] flex-col gap-6 px-4">
        <StudentHeader />
        <ActiveProject />
        <QuickActions />
        <RecentActivities />
      </div>
      <BottomNav />
    </main>
  );
}


