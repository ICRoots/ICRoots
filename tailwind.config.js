/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ICRoots Custom Color Palette
        primary: '#0F2D20',      // Deep Forest Green
        'bitcoin-gold': '#DAA520', // Bitcoin Gold
        'mint-green': '#A5D6A7',   // Mint Green
        'dark-charcoal': '#1E1E1E', // Dark Charcoal
        'light-grey': '#F1F1F1',   // Light Grey
        'risk-red': '#D9534F',     // Risk Red
        'trust-blue': '#007ACC',   // Trust Blue
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'headline': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'subheading': ['24px', { lineHeight: '1.3', fontWeight: '500' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['13px', { lineHeight: '1.4', fontWeight: '300' }],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(218, 165, 32, 0.3)',
        'glow-green': '0 0 20px rgba(165, 214, 167, 0.3)',
        'soft': '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
