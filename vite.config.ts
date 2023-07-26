import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import glsl from "vite-plugin-glsl";

export default defineConfig({
  plugins: [react(), glsl()],
  assetsInclude: ["assets", "**/*.glb", "**/*.hdr", "**/*.tif"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
