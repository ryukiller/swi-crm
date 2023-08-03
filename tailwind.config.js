/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        switheme: {
          "primary": "#1C2333",

          "secondary": "#3C5CA4",

          "accent": "#E9EAF3",

          "neutral": "#7C94C4",

          "base-100": "#FFFFFF",

          "info": "#0ea5e9",

          "success": "#10b981",

          "warning": "#a21caf",

          "error": "#be185d",
        },
      },
    ],
  },
  plugins: [
    require("daisyui"),
    require('@tailwindcss/forms')
  ],
};
