import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 42px rgba(64, 49, 31, 0.10)",
        card: "0 12px 28px rgba(64, 49, 31, 0.07)",
        tile: "0 8px 20px rgba(64, 49, 31, 0.08)"
      },
      colors: {
        ink: "#111111",
        soot: "#242424",
        linen: "#f8f1e6",
        cream: "#fffaf0",
        paper: "#fffdf8",
        mist: "#edf4ee",
        greenSoft: "#dff5e8",
        blueSoft: "#e8ecff",
        orangeSoft: "#ffe8d6",
        roseSoft: "#ffe8ea",
        pine: "#0d6b45",
        clay: "#ef5533",
        brass: "#b98b2f",
        blueInk: "#5468e7",
        roseInk: "#c7354a"
      }
    }
  },
  plugins: []
};

export default config;
