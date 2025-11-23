"use client";

export default function ComingSoon({ title, description, icon }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 animate-fadeInUp">
      
      <div className="p-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 shadow-md mb-6">
        {icon}
      </div>

      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      <p className="text-gray-500 mt-2 max-w-md">{description}</p>

      <div className="mt-6">
        <span className="px-5 py-2 text-sm rounded-full bg-blue-600 text-white shadow animate-pulse">
          Coming Soon...
        </span>
      </div>
    </div>
  );
}
