import type { Config } from "tailwindcss";

// Design system carried over from the Mì prototype (spec §9).
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B1712",
        paper: "#F7EFE1",
        "paper-dim": "#EFE4CE",
        card: "#FFFCF6",
        red: {
          DEFAULT: "#B23225",
          dark: "#8B2419",
        },
        jade: "#2F6E5C",
        gold: "#C79A3B",
        muted: "#7a7163",
        faint: "#9a8f7d",
      },
      borderColor: {
        line: "rgba(27,23,18,0.12)",
      },
      fontFamily: {
        // body / UI
        sans: ["var(--font-work-sans)", "system-ui", "sans-serif"],
        // display / CJK
        serif: ["var(--font-noto-serif-sc)", "serif"],
        // numerals / data
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      maxWidth: {
        app: "460px",
      },
      boxShadow: {
        app: "0 10px 30px rgba(27,23,18,0.12)",
        seal: "0 3px 0 rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
