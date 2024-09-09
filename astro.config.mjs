import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import tailwind from "@astrojs/tailwind";
import solidJs from "@astrojs/solid-js";

export default defineConfig({
  site: "https://arena.ikhode.site",
  output: "server",  // Make sure this is correct
  adapter: vercel(),
  integrations: [tailwind(), solidJs()],
});
