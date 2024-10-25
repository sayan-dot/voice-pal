import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/voice-pal/", // Include slashes before and after the repo name
  plugins: [react()],
});
