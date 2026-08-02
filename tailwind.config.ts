import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefdf5",
          100: "#d6fae6",
          200: "#aef2cf",
          300: "#75e6b0",
          400: "#3ed08c",
          500: "#17b571",
          600: "#0d925b",
          700: "#0c744b",
          800: "#0d5c3d",
          900: "#0c4c34",
        },
        ember: {
          500: "#ff6b35",
          600: "#eb5320",
        },
        ink: {
          900: "#0f172a",
          800: "#1e293b",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 10px rgba(15, 23, 42, 0.06)",
        cardHover: "0 8px 24px rgba(15, 23, 42, 0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
