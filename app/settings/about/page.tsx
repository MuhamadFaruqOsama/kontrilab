import packageJson from "@/package.json";
import { AboutSettingsPage } from "@/app/components/student/settings/SettingsPages";
export default function Page() { return <AboutSettingsPage version={packageJson.version} />; }
