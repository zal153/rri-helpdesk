import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { viteSourceLocator } from "@metagptx/vite-plugin-source-locator";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // base diperlukan agar asset memuat dengan benar saat dihosting di GitHub Pages:
  // https://<username>.github.io/<repo>/ ...
  // Ganti 'rri-helpdesk' jika repo punya nama berbeda atau gunakan '/' untuk custom domain.
  base: mode === 'production' ? '/rri-helpdesk/' : '/',
  plugins: [
    viteSourceLocator({
      prefix: "mgx",
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
