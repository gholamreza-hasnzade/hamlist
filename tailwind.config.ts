import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./.storybook/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: { sans: ["var(--font-vazir)", "system-ui", "sans-serif"] },
      colors: {
        ink: "var(--ink)", muted: "var(--muted)", line: "var(--line)",
        surface: "var(--surface)", brand: "var(--brand)",
      },
      boxShadow: { soft: "var(--shadow)" },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
};
export default config;
