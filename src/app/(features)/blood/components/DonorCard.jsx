export default function DonorCard({ donor }) {
  return (
    <div className=" border border-red-100 rounded-lg shadow-md p-6 bg-white hover:shadow-lg transition flex flex-col justify-between h-full">
      {/* Name & Blood Group */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-red-600 mb-1">{donor.name}</h2>
        <p className="text-lg font-semibold text-gray-800">
          Blood Group:{" "}
          <span className="text-red-500 font-bold">{donor.bloodGroup}</span>
        </p>
      </div>

      {/* Location */}
      <div className="mb-3 text-gray-700 text-sm">
        {donor.district && (
          <p>
            <span className="font-medium text-gray-800">District:</span>{" "}
            {donor.district}
          </p>
        )}
        {donor.thana && (
          <p>
            <span className="font-medium text-gray-800">Thana:</span>{" "}
            {donor.thana}
          </p>
        )}
      </div>

      {/* Contact Info */}
      <div className="mb-3 text-gray-700 text-sm">
        {donor.contact && (
          <p>
            <span className="font-medium text-gray-800">Phone:</span>{" "}
            {donor.contact}
          </p>
        )}
        {donor.whatsapp && (
          <p>
            <span className="font-medium text-gray-800">WhatsApp:</span>{" "}
            {donor.whatsapp}
          </p>
        )}
        {donor.email && (
          <p>
            <span className="font-medium text-gray-800">Email:</span>{" "}
            {donor.email}
          </p>
        )}
        {donor.emergencyContact && (
          <p>
            <span className="font-medium text-gray-800">Emergency:</span>{" "}
            {donor.emergencyContact}
          </p>
        )}
      </div>

      {/* Extra Info */}
      <div className="mb-4 text-sm text-gray-600 space-y-1">
        {donor.profession && (
          <p>
            <span className="font-medium text-gray-800">Profession:</span>{" "}
            {donor.profession}
          </p>
        )}
        {donor.dob && (
          <p>
            <span className="font-medium text-gray-800">Date of Birth:</span>{" "}
            {donor.dob}
          </p>
        )}
        {donor.lastDonation && (
          <p>
            <span className="font-medium text-gray-800">Last Donation:</span>{" "}
            {donor.lastDonation}
          </p>
        )}
        {donor.preferredContact && (
          <p>
            <span className="font-medium text-gray-800">Preferred Contact:</span>{" "}
            {donor.preferredContact}
          </p>
        )}
        {donor.healthConditions && (
          <p>
            <span className="font-medium text-gray-800">Health Notes:</span>{" "}
            {donor.healthConditions}
          </p>
        )}
        {donor.notes && (
          <p>
            <span className="font-medium text-gray-800">Notes:</span>{" "}
            {donor.notes}
          </p>
        )}
      </div>

      {/* Call / WhatsApp Buttons */}
      <div className="mt-auto flex flex-wrap gap-3">
        {donor.contact && (
          <a
            href={`tel:${donor.contact}`}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            📞 Call Now
          </a>
        )}
        {donor.whatsapp && (
          <a
            href={`https://wa.me/${donor.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            💬 WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
