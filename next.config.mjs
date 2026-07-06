/** @type {import('next').NextConfig} */
const isRender = process.env.RENDER === "true";

const nextConfig = {
  reactStrictMode: true,
  // Match sitemap, canonical tags, and internal links (all use trailing slashes).
  trailingSlash: true,
  // Render Starter (~512MB) OOMs during `next build` typecheck/lint.
  ...(isRender && {
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
  }),
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};
export default nextConfig;
