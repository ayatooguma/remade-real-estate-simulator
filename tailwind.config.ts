import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#2C3E50",
        navy: "#1E3A5F",
        gold: "#D4AF37",
        orange: "#E67E22",
        mist: "#F5F5F5",
        forest: "#2E7D62",
        clay: "#A65F3B"
      },
      boxShadow: {
        soft: "0 22px 60px rgba(30, 58, 95, 0.12)"
      },
      fontFamily: {
        sans: [
          "Inter",
          "Noto Sans JP",
          "Hiragino Sans",
          "Yu Gothic",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
};

export default config;
