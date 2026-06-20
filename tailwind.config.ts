import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f7ef",
          100: "#e7ecd8",
          500: "#6d7f3f",
          600: "#596932",
          700: "#455128",
        },
      },
      boxShadow: {
        soft: "0 18px 50px rgba(31, 41, 55, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
