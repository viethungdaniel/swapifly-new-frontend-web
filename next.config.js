/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config");
const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  i18n: {
    localeDetection: false,
    ...i18n,
  },
  experimental: {
    urlImports: [
      "https://res.wx.qq.com/connect/en_US/htmledition/js/wxLogin.js",
      "https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js",
    ],
    optimizePackageImports: [
      "lodash",
      "@mui/material",
      "@mui/icons-material",
      "@mui/x-date-pickers",
    ],
  },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  images: {
    formats: ["image/webp"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_CDN_DOMAIN,
      },
    ],
    deviceSizes: [600, 1200],
  },
  productionBrowserSourceMaps: true,
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  rewrites() {
    return [
      {
        source: "/userDetails",
        destination: "/api/web/v1/user-profile-page-redirect",
      },
      {
        source: "/goodsDetails",
        destination: "/api/web/v1/product-details-page-redirect",
      },
      {
        source: "/goodsList",
        destination: "/api/web/v1/category-products-page-redirect",
      },
      {
        source: "/helpCenter",
        destination: "/api/web/v1/help-center-page-redirect",
      },
      {
        source: "/helpCenter/detail",
        destination: "/api/web/v1/help-center-details-page-redirect",
      },
      {
        source: "/newsCenter",
        destination: "/api/web/v1/news-page-redirect",
      },
      {
        source: "/newsCenter/detail",
        destination: "/api/web/v1/news-details-page-redirect",
      },

      {
        source: "/firebase-messaging-sw.js",
        destination: "/api/firebase-messaging-sw",
      },
      {
        source: "/apple-app-site-association",
        destination: "/api/apple-app-site-association",
      },
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
      {
        source: "/ads.txt",
        destination: "/api/ads",
      },
      {
        source: "/app-ads.txt",
        destination: "/api/app-ads",
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      type: "asset",
      resourceQuery: /url/,
    });
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      resourceQuery: { not: [/url/] },
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

module.exports = withPlugins([[withBundleAnalyzer]], nextConfig);
