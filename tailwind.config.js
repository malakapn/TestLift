/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0fa',
          100: '#cce0f5',
          200: '#99c2eb',
          300: '#66a3e0',
          400: '#3385d6',
          500: '#1A56A0',
          600: '#154580',
          700: '#103460',
          800: '#0a2240',
          900: '#051120',
        },
        accent: {
          50: '#fef7ed',
          100: '#fdeeda',
          200: '#faddb5',
          300: '#f7cd90',
          400: '#f4bc6b',
          500: '#854F0B',
          600: '#6a3f09',
          700: '#502f07',
          800: '#351f04',
          900: '#1b1002',
        },
        success: {
          50: '#ecf5e7',
          100: '#d9ebcf',
          200: '#b3d79f',
          300: '#8dc36f',
          400: '#67af3f',
          500: '#3B6D11',
          600: '#2f570e',
          700: '#23410a',
          800: '#172c07',
          900: '#0c1603',
        },
        dark: '#1A1A2E',
        body: '#555566',
        section: '#F4F4F4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
