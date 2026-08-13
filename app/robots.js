export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/cache',
          '/cache/*',
          '/debug-internal-config-manager-v2',
          '/debug-internal-config-manager-v2/*',
          '/api/',
          '/api/*',
        ],
      },
    ],
  };
}
