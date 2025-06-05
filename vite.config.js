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
      },
      "/api/cloudfront": {
        target: "https://d1nklfio7vscoe.cloudfront.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cloudfront/, ""),
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes, req, res) => {
            // CORS Headers hinzufügen
            proxyRes.headers["access-control-allow-origin"] = "*";
            proxyRes.headers["access-control-allow-methods"] = "GET";
            delete proxyRes.headers["x-frame-options"];
          });
        },
      },
    },
  },
});
