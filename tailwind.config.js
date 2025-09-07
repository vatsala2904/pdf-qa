/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: "#ff38c8",
          yellow: "#faff00",
          orange: "#ff7a00",
          red: "#ff2e2e",
          blue: "#00e5ff",
          dblue: "#0011ff",
        },
      },
      dropShadow: {
        neonPink: ["0 0 6px #ff38c8", "0 0 16px #ff38c8"],
        neonYellow: ["0 0 6px #faff00", "0 0 16px #faff00"], // used for ASK PDF
      },
      boxShadow: { glow: "0 0 40px rgba(255,56,200,.35)" },
      keyframes: {
        slideUp: { "0%": { transform: "translateY(0%)" }, "100%": { transform: "translateY(-100%)" } },
        pulseNeon: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.65 } },
      },
      animation: {
        slideUp: "slideUp 1s ease-out forwards",
        pulseNeon: "pulseNeon 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
