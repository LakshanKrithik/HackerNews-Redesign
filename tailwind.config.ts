
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"], // Using 'class' for potential future dark mode toggle, though primary theme is dark.
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
        'pixel': ['"Press Start 2P"', 'monospace'],
        'sans': ['Inter', 'sans-serif'],
      },
			colors: {
        'hn-background': '#0D0D0D',
        'hn-text': '#E6E6E6',
        'hn-accent': '#FF3C00', // Hacker News orange-red
        'hn-accent-secondary': '#00FFE7', // Aqua cyan
        'hn-border': '#2A2A2A',
        'hn-glitch-yellow': '#FFFC00',
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))', // Keep shadcn defaults but we'll override with hn-background
				foreground: 'hsl(var(--foreground))', // Keep shadcn defaults but override with hn-text
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
          foreground: '#999999', // For metadata
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			borderRadius: {
				lg: '0px', // Pixel art often has sharp edges
				md: '0px',
				sm: '0px'
			},
			boxShadow: {
        'pixel': '2px 2px 0px #2A2A2A',
        'pixel-sm': '1px 1px 0px #2A2A2A',
        'pixel-accent': '2px 2px 0px #FF3C00',
      },
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
        'glitch-subtle': {
          '0%, 100%': { transform: 'translateX(0)', color: 'var(--glitch-color1, #FF3C00)' },
          '25%': { transform: 'translateX(-1px) skewX(-1deg)', color: 'var(--glitch-color2, #00FFE7)' },
          '50%': { transform: 'translateX(1px) skewX(1deg)', color: 'var(--glitch-color3, #FFFC00)' },
          '75%': { transform: 'translateX(-0.5px) skewX(-0.5deg)', color: 'var(--glitch-color1, #FF3C00)' },
        },
        'glitch-hover': {
          '0%': { transform: 'translate(0, 0) skew(0deg)', opacity: 1 },
          '10%': { transform: 'translate(-2px, 1px) skew(-2deg)', opacity: 0.8 },
          '20%': { transform: 'translate(1px, -1px) skew(3deg)', opacity: 1 },
          '30%': { transform: 'translate(-1px, 2px) skew(-1deg)', opacity: 0.7 },
          '40%': { transform: 'translate(2px, -2px) skew(1deg)', opacity: 1 },
          '50%': { transform: 'translate(0, 0) skew(0deg)', opacity: 0.9 },
          '60%': { transform: 'translate(-2px, 1px) skew(2deg)', opacity: 1 },
          '70%': { transform: 'translate(1px, -1px) skew(-3deg)', opacity: 0.8 },
          '80%': { transform: 'translate(-1px, 2px) skew(1deg)', opacity: 1 },
          '90%': { transform: 'translate(2px, -2px) skew(-1deg)', opacity: 0.7 },
          '100%': { transform: 'translate(0, 0) skew(0deg)', opacity: 1 },
        },
        'pixel-spinner': {
          '0%, 100%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(0.5)', opacity: 0.5 },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'text-shadow-glitch': {
          '0%': { textShadow: '1px 0 #FF3C00, -1px 0 #00FFE7' },
          '25%': { textShadow: '-1px 0 #FF3C00, 1px 0 #00FFE7' },
          '50%': { textShadow: '1px 0 #00FFE7, -1px 0 #FF3C00' },
          '75%': { textShadow: '-1px 0 #00FFE7, 1px 0 #FF3C00' },
          '100%': { textShadow: '1px 0 #FF3C00, -1px 0 #00FFE7' },
        },
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
        'glitch-subtle': 'glitch-subtle 2s infinite steps(1, end) alternate',
        'glitch-hover': 'glitch-hover 0.3s linear',
        'pixel-spinner-delay-1': 'pixel-spinner 1s infinite ease-in-out',
        'pixel-spinner-delay-2': 'pixel-spinner 1s 0.2s infinite ease-in-out',
        'pixel-spinner-delay-3': 'pixel-spinner 1s 0.4s infinite ease-in-out',
        'flicker': 'flicker 1.5s infinite alternate',
        'text-shadow-glitch': 'text-shadow-glitch 0.3s linear infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
