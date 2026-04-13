/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        wcam: {
          orange: "#FF6B00",
          orangeHover: "#E05D00",
          black: "#0A0A0A",
          card: "#111111",
          border: "#222222",
          input: "#1A1A1A",
          panel: "#0D0D0D",
        },
      },
      fontFamily: {
        mono: ['"Geist Mono"', "monospace"],
      },
      boxShadow: {
        soft: "0 12px 40px rgba(0, 0, 0, 0.35)",
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: 0.6, transform: "scale(1)" },
          "50%": { opacity: 1, transform: "scale(1.05)" },
        },
      },
      animation: {
        pulseSoft: "pulseSoft 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
