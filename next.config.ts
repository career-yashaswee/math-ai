import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google avatars
      },
      {
        protocol: "https",
        hostname: "*.supabase.co", // Supabase storage
      },
    ],
  },
  // Required for @uiw/react-md-editor
  transpilePackages: ["@uiw/react-md-editor", "@uiw/codemirror-theme-github"],
};

export default nextConfig;
