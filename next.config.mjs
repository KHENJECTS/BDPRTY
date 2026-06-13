/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // R3F: hindari double-invoke efek WebGL
  webpack: (config) => {
    // Muat shader GLSL sebagai string mentah (lihat src/.../shaders + glsl.d.ts)
    config.module.rules.push({
      test: /\.(glsl|vert|frag|vs|fs)$/,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
