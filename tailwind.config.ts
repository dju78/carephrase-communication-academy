import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9eaff",
          200: "#bcdaff",
          300: "#8ec2ff",
          400: "#599fff",
          500: "#337bff",
          600: "#1d5cf5",
          700: "#1647e1",
          800: "#183bb6",
          900: "#19378f",
        },
      },
    },
  },
  plugins: [],
};

export default config;
