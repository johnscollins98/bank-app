import { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  logging: {
    fetches:
      process.env.NODE_ENV === "development"
        ? {
            fullUrl: false,
          }
        : undefined,
  },
};

export default nextConfig;
