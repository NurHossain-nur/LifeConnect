// import ComingSoon from "@/components/ComingSoon";

import ComingSoon from "../../components/ComingSoon";

export default function OrdersPage() {
  return (
    <ComingSoon 
      title="Orders"
      description="Order tracking, filtering, and management features are coming soon!"
      icon={
        <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h3l2 3h5a2 2 0 012 2v12a2 2 0 01-2 2z"/>
        </svg>
      }
    />
  );
}
