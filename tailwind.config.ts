import { type Config } from "tailwindcss";
import { nextui } from "@nextui-org/theme";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        display: "var(--body-font)",
        body: "var(--body-font)",
        "*": "var(--body-font)",
      },
      keyframes: {
        heartbeat: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
        levitate: {
          "0%": {
            transform: "translateY(0)",
          },
          "30%": {
            transform: "translateY(-10px)",
          },
          "50%": {
            transform: "translateY(4px)",
          },
          "70%": {
            transform: "translateY(-15px)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        expand: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        heartbeat: "heartbeat 1s ease-in-out infinite",
        levitate: "levitate 5s ease infinite",
        expand: "expand 6s ease-out infinite both",
      },
      colors: {
        primary: "#69e876",
        englishBlue: {
          100: "#3498db",
          200: "#2085c3",
          300: "#0f72ab",
          400: "#0a5a8c",
          500: "#084269",
          600: "#063956",
          700: "#042641",
          800: "#031c2c",
          900: "#021319",
        },
        englishRed: {
          100: "#e74c3c",
          200: "#d43a2b",
          300: "#c1291a",
          400: "#a11b0e",
          500: "#7f0d02",
          600: "#6c0c01",
          700: "#590a01",
          800: "#460900",
          900: "#340700",
        },
        primaryBackground: {
          100: "#1a202c",
          200: "#141b24",
          300: "#0f151d",
          400: "#0b1016",
          500: "#060a0f",
          600: "#05090d",
          700: "#04070b",
          800: "#030509",
          900: "#020307",
        },
        secondaryBackground: {
          100: "#2d3748",
          200: "#252f3d",
          300: "#1e2832",
          400: "#161e27",
          500: "#0f1621",
          600: "#0d141d",
          700: "#0a1018",
          800: "#080d14",
          900: "#050a0f",
        },
        primaryText: {
          100: "#ffffff",
          200: "#f2f2f2",
          300: "#e5e5e5",
          400: "#d8d8d8",
          500: "#cbcbcb",
          600: "#aeaeae",
          700: "#919191",
          800: "#747474",
          900: "#575757",
        },
        secondaryText: {
          100: "#cbd5e0",
          200: "#b4c1cc",
          300: "#9caeb9",
          400: "#859aa5",
          500: "#6d8792",
          600: "#56647e",
          700: "#3f506b",
          800: "#283d57",
          900: "#112a44",
        },
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        // dark: {
        //   colors: {
        //     secondary: {
        //       DEFAULT: "#0070EF",
        //       foreground: "#fff",
        //     },
        //   },
        // },
        // light: {
        //   colors: {
        //     secondary: {
        //       DEFAULT: "#0070EF",
        //       foreground: "#fff",
        //     },
        //   },
        // },
      },
    }),
  ],
} satisfies Config;
