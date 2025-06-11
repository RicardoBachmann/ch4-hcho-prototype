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
      "/api/dlr-download": {
        target: "https://download.geoservice.dlr.de",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dlr-download/, ""),
      },
    },
  },
});
