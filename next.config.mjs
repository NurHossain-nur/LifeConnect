/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["res.cloudinary.com"], // whitelist Cloudinary
    },
};

export default nextConfig;
