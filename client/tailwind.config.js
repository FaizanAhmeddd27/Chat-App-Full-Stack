import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],   // ✅ ECM import works here
  daisyui: {
    themes: ["light", "dark", "cupcake"], // ✅ Optional themes
  },
}
