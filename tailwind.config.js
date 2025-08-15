/** @type {import('tailwindcss').Config} */
      module.exports = {
        content: [
          "./src/**/*.{js,jsx,ts,tsx}",
        ],
        theme: {
          extend: {},
        },
        plugins: [],
      }
// v2 accent color (vanity style)
module.exports.theme = Object.assign({}, module.exports.theme || {}, { extend: Object.assign({}, (module.exports.theme||{}).extend||{}, { colors: { accent: '#1de9b6' }})});
