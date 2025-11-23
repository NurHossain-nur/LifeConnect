// import ComingSoon from "@/components/ComingSoon";

import ComingSoon from "../../components/ComingSoon";

export default function SettingsPage() {
  return (
    <ComingSoon 
      title="Settings"
      description="Customize your platform preferences and manage admin settings soon."
      icon={
        <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 3h4m-2 4v4m-7 2a2 2 0 002 2h10a2 2 0 002-2m-2 2v4m-6-4v4"/>
        </svg>
      }
    />
  );
}
