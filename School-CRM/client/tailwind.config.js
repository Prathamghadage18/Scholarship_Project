// tailwind.config.js
module.exports = {
  
  darkMode: 'class', // IMPORTANT!
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
      // primary:'#2563eb', primaryLight:'#e3f1f5',
      // primary:'#7e22ce', primaryLight:'#f2e4ff', 
      primary:'#0a6eff', primaryLight:'#e7ccff', bgDarkColor:"#111315"
      },
    },
  },
  plugins: [],

}; 

// primary:'#7e22ce', primaryLight:'#e7ccff', purple