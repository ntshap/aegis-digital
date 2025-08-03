import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config: any) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      path: false,
      os: false,
      util: false,
      child_process: false,
      worker_threads: false,
    };

    // Ignore pino and other Node.js specific modules in browser bundles
    config.externals = config.externals || [];
    config.externals.push({
      'pino': 'commonjs2 pino',
      'pino-pretty': 'commonjs2 pino-pretty',
    });

    return config;
  },
};

export default nextConfig;
