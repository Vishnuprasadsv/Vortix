import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Export the Vite configuration
export default defineConfig({
  // Load plugins for React and Tailwind CSS
  plugins: [react(), tailwindcss()],
});
