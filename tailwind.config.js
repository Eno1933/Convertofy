/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00458e",
        "primary-container": "#1e5db0",
        secondary: "#006b5f",
        "secondary-container": "#6cf5e1",
        surface: "#f7f9fb",
        "surface-lowest": "#ffffff",
        "surface-low": "#f2f4f6",
        "surface-high": "#e0e3e5",
        "on-surface": "#191c1e",
        "on-surface-variant": "#424752",
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      borderRadius: {
        md: "0.375rem",
        lg: "0.5rem",
      },
      backdropBlur: {
        xs: "20px",
      },
    },
  },
  plugins: [],
}