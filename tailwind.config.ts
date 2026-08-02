import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Verde-água vibrante, no espírito de apps de corrida modernos
        brand: {
          50: "#effcf9",
          100: "#c8f6ec",
          200: "#96ecda",
          300: "#5edcc4",
          400: "#2cc9ac",
          500: "#0fb89a",
          600: "#0a9680",
          700: "#0a7867",
          800: "#0b5f54",
          900: "#0b4e46",
        },
        ember: {
          500: "#ff6b35",
          600: "#eb5320",
        },
        // Preto quase puro, para headlines e botões primários
        ink: {
          950: "#0a0a0d",
          900: "#111114",
          800: "#1c1c22",
          700: "#2a2a33",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(10, 10, 13, 0.04), 0 1px 12px rgba(10, 10, 13, 0.05)",
        cardHover: "0 4px 8px rgba(10, 10, 13, 0.06), 0 12px 32px rgba(10, 10, 13, 0.1)",
      },
      borderRadius: {
        xl2: "1.5rem",
        xl3: "2rem",
      },
      letterSpacing: {
        tightest: "-0.045em",
        wide2: "0.08em",
      },
    },
  },
  plugins: [],
};
export default config;
