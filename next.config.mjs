/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
};

export default nextConfig;