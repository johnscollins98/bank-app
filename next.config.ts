import { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
