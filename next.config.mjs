const nextConfig = {
    output: 'export',
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
    trailingSlash: true,
    distDir: 'out',
};

export default nextConfig;
