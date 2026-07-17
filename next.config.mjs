/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage public URLs
      { protocol: "https", hostname: "*.supabase.co" },
      // Seed data uses Unsplash imagery for hero photos
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
