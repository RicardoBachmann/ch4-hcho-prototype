import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

console.log("VITE CONFIG LOADED!");

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
        followRedirects: true,
        rewrite: (path) => {
          console.log("NASA PROXY HIT:", path);
          return path.replace(/^\/api\/nasa/, "");
        },
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            if (process.env.VITE_NASA_TOKEN) {
              console.log(
                "🔍 Environment check:",
                !!process.env.VITE_NASA_TOKEN
              );
              console.log(
                "🔍 Token length:",
                process.env.VITE_NASA_TOKEN?.length || 0
              );
              proxyReq.setHeader(
                "Authorization",
                `Bearer ${process.env.VITE_NASA_TOKEN}`
              );
              console.log("Token added to request");
            } else {
              console.log("NO token found...");
            }
          });
          proxy.on("proxyRes", (proxyRes, req, res) => {
            proxyRes.headers["access-control-allow-origin"] = "*";
            delete proxyRes.headers["x-frame-options"];
          });
        },
      },
      "/api/cloudfront": {
        target: "https://d1nklfio7vscoe.cloudfront.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cloudfront/, ""),
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes, req, res) => {
            proxyRes.headers["access-control-allow-origin"] = "*";
            delete proxyRes.headers["x-frame-options"];
          });
        },
      },
    },
  },
});
