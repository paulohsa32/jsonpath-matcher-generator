import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  modules: ["nuxt-monaco-editor", "@nuxtjs/tailwindcss", "nuxt-icon"],
  ssr: true,
});
