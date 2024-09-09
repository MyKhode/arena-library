import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import tailwind from "@astrojs/tailwind";
import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  site: "https://MyKhode.github.io",
  output: "server",
  adapter: vercel(),
  integrations: [tailwind(), solidJs()],
});
