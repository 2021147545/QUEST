import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        alumni: ['"Alumni Sans SC"', 'sans-serif'],
        nanum: ['"NanumSquare"', 'sans-serif'],
      },
    },
  },
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  plugins: [],
};

export default config;
