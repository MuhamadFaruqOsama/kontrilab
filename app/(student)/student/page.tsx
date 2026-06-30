import StudentHeader from "@/app/components/student/StudentHeader";
import ActiveProject from "@/app/components/student/ActiveProject";
import ContributionCard from "@/app/components/student/ContributionCard";
import RecentActivities from "@/app/components/student/RecentActivities";
import QuickActions from "@/app/components/student/QuickActions";
import BottomNav from "@/app/components/student/BottomNav";

export default function StudentHomePage() {
  return (
    <main className="relative min-h-screen bg-background pb-[112px] pt-[14px] text-foreground">
      <div className="mx-auto w-full max-w-[430px] px-4">
        <StudentHeader />
        <ActiveProject />
        <ContributionCard />
        <RecentActivities />
        <QuickActions />
      </div>
      <BottomNav />
    </main>
  );
}

