/** @type {import('next').NextConfig} */
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [require("remark-prism")],
  },
});

const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  // Pin the workspace root to THIS project. A stray package-lock.json in a parent
  // folder was making Next infer an enormous parent dir as the root and watch that
  // whole tree, which wedged `next dev`. Scope file tracing/watching to here.
  outputFileTracingRoot: __dirname,
  // Optionally, add any other Next.js config below
};

module.exports = withMDX(nextConfig);
