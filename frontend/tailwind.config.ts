import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Void Black Palette
        void: {
          950: "#09090b",
          900: "#18181b",
          800: "#27272a",
        },
        // Blaze Orange Palette
        blaze: {
          500: "#f97316",
          400: "#fbbf24",
          glow: "rgba(249, 115, 22, 0.5)",
        },
        critical: "#ef4444",
        warning: "#f59e0b",
        success: "#10b981",
      },
      backdropBlur: {
        xs: "2px",
        glass: "16px",
      },
      borderRadius: {
        glass: "16px",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.5)",
        glow: "0 0 40px -10px rgba(249, 115, 22, 0.4)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
}

export default config
