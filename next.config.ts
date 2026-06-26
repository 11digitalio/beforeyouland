import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/.next/**",
          "**/node_modules/**",
          "**/dist/**",
          "**/outputs/**",
          "**/scripts/__pycache__/**"
        ]
      };
    }

    return config;
  }
};

export default nextConfig;
