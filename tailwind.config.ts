import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        platinum: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d4d9e3",
          300: "#aeb7ca",
          400: "#8290ab",
          500: "#637191",
          600: "#4e5a78",
          700: "#404962",
          800: "#383f53",
          900: "#1a1f2e",
          950: "#0d111c",
        },
        accent: {
          400: "#5eead4",
          500: "#14b8a6",
          600: "#0d9488",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
