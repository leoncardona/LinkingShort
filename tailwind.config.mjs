/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    colors: {
      lsblack: "#040404",
      lswhite: "#E4E4E4",
      lsblue: "#0D99FF",
      lsdarkblue: "#0462A7",
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      jakarta: ["Plus Jakarta Sans", "sans-serif"],
    },
    extend: {},
  },
  darkMode: "class",
  plugins: [require("flowbite/plugin")],
};
