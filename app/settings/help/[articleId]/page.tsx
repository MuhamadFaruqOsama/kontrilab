import { HelpArticlePage } from "@/app/components/student/settings/SettingsPages";
export default async function Page({ params }: { params: Promise<{ articleId: string }> }) { const { articleId } = await params; return <HelpArticlePage articleId={articleId} />; }
