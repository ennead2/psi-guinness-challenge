import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import basicSsl from "@vitejs/plugin-basic-ssl";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl(), tsconfigPaths()],
  // 別端末からのアクセスを許可
  server: {
    host: true,
  },
});
