// import ComingSoon from "@/components/ComingSoon";

import ComingSoon from "../../components/ComingSoon";

export default function AllProductsPage() {
    
  return (
    <ComingSoon 
      title="All Products"
      description="We are working on a powerful product management system. Stay tuned!"
      icon={
        <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9-4 9 4-9 4-9-4zm0 6l9 4 9-4"/>
        </svg>
      }
    />
  );
}
