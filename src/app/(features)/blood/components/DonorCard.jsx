"use client";

import { 
  Phone, 
  MapPin, 
  Calendar, 
  User, 
  Heart, 
  MessageCircle, 
  Mail, 
  AlertTriangle, 
  Briefcase, 
  Clock,
  Activity
} from "lucide-react";

export default function DonorCard({ donor }) {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 overflow-hidden flex flex-col h-full transition-all duration-300 transform hover:-translate-y-1">
      
      {/* --- Header Section --- */}
      <div className="relative p-5 pb-4 border-b border-gray-100">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-red-600 transition-colors">
              {donor.name}
            </h2>
            
            {/* Location with Icon */}
            {(donor.district || donor.thana) && (
              <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="line-clamp-1">
                  {[donor.thana, donor.district].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
          </div>

          {/* Blood Group Badge */}
          <div className="flex flex-col items-center justify-center w-12 h-12 bg-red-50 rounded-full border border-red-100 shrink-0">
            <span className="text-xl font-black text-red-600">{donor.bloodGroup}</span>
          </div>
        </div>
      </div>

      {/* --- Details Body --- */}
      <div className="p-5 pt-4 flex-1 space-y-4">
        
        {/* Personal Info Grid */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-sm">
          {donor.profession && (
            <div className="flex items-center gap-2 text-gray-600" title="Profession">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span className="truncate">{donor.profession}</span>
            </div>
          )}
          {donor.dob && (
            <div className="flex items-center gap-2 text-gray-600" title="Date of Birth">
              <User className="w-4 h-4 text-gray-400" />
              <span>{donor.dob}</span>
            </div>
          )}
          {donor.lastDonation && (
            <div className="flex items-center gap-2 text-gray-600 col-span-2" title="Last Donation Date">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="text-gray-700">Last Donated: <span className="font-medium">{donor.lastDonation}</span></span>
            </div>
          )}
        </div>

        {/* Contact Details */}
        <div className="space-y-2 pt-2 border-t border-gray-50">
          {donor.email && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="w-4 h-4" />
              <span>{donor.email}</span>
            </div>
          )}
          {donor.contact && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{donor.contact}</span>
            </div>
          )}
          {donor.emergencyContact && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 px-2 py-1 rounded w-fit">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Emergency: {donor.emergencyContact}</span>
            </div>
          )}
          {donor.whatsapp && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-2 py-1 rounded w-fit">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: {donor.whatsapp}</span>
            </div>
          )}
        </div>

        {/* Notes / Health Info */}
        {(donor.healthConditions || donor.notes) && (
          <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1.5 border border-gray-100">
            {donor.healthConditions && (
              <div className="flex items-start gap-2 text-gray-600">
                <Activity className="w-3.5 h-3.5 text-blue-500 mt-0.5" />
                <span>{donor.healthConditions}</span>
              </div>
            )}
            {donor.notes && (
              <div className="text-gray-500 italic leading-relaxed">
                "{donor.notes}"
              </div>
            )}
          </div>
        )}
        
        {/* Preferred Contact */}
        {donor.preferredContact && (
           <p className="text-[10px] text-gray-400 text-right uppercase font-semibold tracking-wide">
             Prefers: {donor.preferredContact}
           </p>
        )}
      </div>

      {/* --- Action Footer --- */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex gap-3">
        {donor.contact ? (
          <a
            href={`tel:${donor.contact}`}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all shadow-sm text-sm font-semibold"
          >
            <Phone className="w-4 h-4" />
            Call: {donor.contact}
          </a>
        ) : (
          <button disabled className="flex-1 py-2 text-center text-gray-400 text-sm bg-gray-100 rounded-lg cursor-not-allowed">
            No Phone
          </button>
        )}

        {donor.whatsapp ? (
          <a
            href={`https://wa.me/${donor.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors shadow-sm text-sm font-semibold"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp: {donor.whatsapp}
          </a>
        ) : (
           <button disabled className="flex-1 py-2 text-center text-gray-300 text-sm bg-gray-100 rounded-lg cursor-not-allowed">
             No WA
           </button>
        )}
      </div>
    </div>
  );
}
