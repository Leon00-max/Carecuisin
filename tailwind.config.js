/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,mdx}",
    "./src/components/**/*.{js,jsx}",
    "./src/lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Medical Blue – trust, authority, hygiene
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#2563eb',   // main action buttons
          600: '#1e40af',
          700: '#1e3a8a',
        },
        // Neutral shades – clean card backgrounds and text
        surface: {
          50: '#f8fafc',    // app background
          100: '#f1f5f9',   // card borders
          200: '#e2e8f0',
          800: '#1e293b',   // primary text
          900: '#0f172a',
        },
        // Semantic accents for status (used sparingly)
        success: '#10b981',  // meal prepared, plan active
        warning: '#f59e0b',  // pending review
        alert: '#ef4444',    // allergies, rejected, critical
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}