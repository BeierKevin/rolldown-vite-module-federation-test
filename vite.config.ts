import react from "@vitejs/plugin-react";
// Option 1
import { defineConfig, moduleFederationPlugin } from "vite";

// Option 2
// import { defineConfig } from "vite";
// import { moduleFederationPlugin } from "rolldown/experimental";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Neither the remoteEntry.js nor the manifest.json are accessable from the browser in dev mode
    moduleFederationPlugin({
      name: "mf-host",
      filename: "remoteEntry.js",
      manifest: true,
      remotes: {
        // Copied from Rolldown Module Federation Example: https://github.com/rolldown/rolldown/tree/main/examples/module-federation
        webpack:
          "webpack@https://unpkg.com/rolldown-mf-webpack-remote@1.0.0/dist/remoteEntry.js",
      },
      exposes: {},
      shared: {},
      getPublicPath: "http://localhost:3000/",
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
});
