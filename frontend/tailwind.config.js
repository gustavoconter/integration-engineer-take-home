/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", "sans-serif"],
				serif: ["Inter", "sans-serif"],
				mono: ["Inter", "sans-serif"],
			},
		},
	},
	plugins: [],
};
