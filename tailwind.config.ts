import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        signlang: {
          primary: "#7BDCB5",
          accent: "#F2FBF7",
          dark: "#00341B",
          background: "#FFFFFF"
        }
      }
    },
  },
  plugins: [],
};

export default config; 