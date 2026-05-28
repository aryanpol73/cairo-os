import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Disables PWA caching during local dev
  register: true,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ... any other config you might already have in there
};

export default withPWA(nextConfig);