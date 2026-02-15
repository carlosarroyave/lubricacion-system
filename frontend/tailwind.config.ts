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
        critical: "#EF4444",
        warning: "#F59E0B",
        success: "#10B981",
        glass: {
          light: "rgba(255, 255, 255, 0.15)",
          border: "rgba(255, 255, 255, 0.2)",
        },
      },
      backdropBlur: {
        xs: "2px",
        glass: "16px",
      },
      borderRadius: {
        glass: "16px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.1)",
        glow: "0 0 20px rgba(0, 102, 204, 0.4)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "mesh-gradient":
          "radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.1) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 0.1) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 0.1) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 0.1) 0px, transparent 50%), radial-gradient(at 97% 96%, hsla(38, 60%, 74%, 0.1) 0px, transparent 50%), radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 0.1) 0px, transparent 50%), radial-gradient(at 79% 53%, hsla(343, 68%, 79%, 0.1) 0px, transparent 50%)",
      },
    },
  },
  plugins: [],
}

export default config
