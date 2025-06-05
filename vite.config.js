import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/n2yo": {
        target: "https://api.n2yo.com/rest/v1/satellite",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/n2yo/, ""),
      },
      "/api/dlr": {
        target: "https://geoservice.dlr.de",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dlr/, ""),
      },
      "/api/nasa": {
        target: "https://data.lpdaac.earthdatacloud.nasa.gov",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nasa/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            // Add Bearer Token
            if (process.env.VITE_NASA_TOKEN) {
              proxyReq.setHeader(
                "Authorization",
                `Bearer ${process.env.VITE_NASA_TOKEN}`
              );
              console.log("NASA Bearer Token added to request");
            } else {
              console.warn("VITE_NASA_TOKEN not found in environment");
            }
            // Additional NASA-specific headers
            proxyReq.setHeader("User-Agent", "EMIT-Methane-Viewer/1.0");
            proxyReq.setHeader("Accept", "image/png,image/jpeg,image/*,*/*");
            proxyReq.setHeader("Cache-Control", "no-cache");

            console.log("NASA Request headers:", {
              "User-Agent": proxyReq.getHeader("User-Agent"),
              Authorization: proxyReq.getHeader("Authorization")
                ? "Bearer ***"
                : "Missing",
              Accept: proxyReq.getHeader("Accept"),
            });
          });

          proxy.on("proxyRes", (proxyRes, req, res) => {
            // CORS Headers for Client
            proxyRes.headers["access-control-allow-origin"] = "*";
            proxyRes.headers["access-control-allow-methods"] =
              "GET, POST, OPTIONS";
            proxyRes.headers["access-control-allow-headers"] =
              "Authorization, Content-Type, Cache-Control, User-Agent";

            // Remove problematic headers
            delete proxyRes.headers["x-frame-options"];
            delete proxyRes.headers["content-security-policy"];

            console.log(" NASA Response:", {
              status: proxyRes.statusCode,
              contentType: proxyRes.headers["content-type"],
              contentLength: proxyRes.headers["content-length"],
            });
          });

          proxy.on("error", (err, req, res) => {
            console.error("NASA Proxy Error:", err.message);
          });
        },
      },
      // CloudFront Proxy (Fallback without Auth)
      "/api/cloudfront": {
        target: "https://d1nklfio7vscoe.cloudfront.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cloudfront/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            proxyReq.setHeader("User-Agent", "EMIT-Methane-Viewer/1.0");
            proxyReq.setHeader("Accept", "image/png,image/jpeg,image/*,*/*");
            console.log("☁️ CloudFront request to:", proxyReq.path);
          });

          proxy.on("proxyRes", (proxyRes, req, res) => {
            proxyRes.headers["access-control-allow-origin"] = "*";
            proxyRes.headers["access-control-allow-methods"] = "GET";
            proxyRes.headers["access-control-allow-credentials"] = "false";
            delete proxyRes.headers["x-frame-options"];

            console.log("☁️ CloudFront Response:", {
              status: proxyRes.statusCode,
              contentType: proxyRes.headers["content-type"],
            });
          });
        },
      },
    },
  },
});
