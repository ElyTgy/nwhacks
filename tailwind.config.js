module.exports = {
    darkMode: ['class'],
    content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
  	height: {
  		dvh: '100dvh'
  	},
  	maxWidth: {
  		'2xs': '16rem',
  		'3xs': '12rem',
  		'4xs': '10rem',
  		'5xs': '6rem',
  		'6xs': '4rem',
  		'7xs': '2rem',
  		xs: '20rem',
  		sm: '24rem',
  		md: '28rem',
  		lg: '32rem',
  		xl: '36rem',
  		'2xl': '42rem',
  		'3xl': '48rem',
  		'4xl': '56rem',
  		'5xl': '64rem',
  		'6xl': '72rem',
  		'7xl': '80rem',
  		'8xl': '88rem',
  		'9xl': '96rem',
  		full: '100%'
  	},
  	minWidth: {
  		'2xs': '16rem',
  		'3xs': '12rem',
  		'4xs': '10rem',
  		'5xs': '6rem',
  		xs: '20rem',
  		sm: '24rem',
  		md: '28rem',
  		lg: '32rem',
  		xl: '36rem',
  		'2xl': '42rem',
  		'3xl': '48rem',
  		'4xl': '56rem',
  		'5xl': '64rem',
  		'6xl': '72rem',
  		'7xl': '80rem',
  		full: '100%'
  	},
  	minHeight: {
  		'2xs': '16rem',
  		'3xs': '12rem',
  		'4xs': '10rem',
  		'5xs': '6rem',
  		xs: '20rem',
  		sm: '24rem',
  		md: '28rem',
  		lg: '32rem',
  		xl: '40rem',
  		'2xl': '42rem',
  		'3xl': '48rem',
  		'4xl': '56rem',
  		'5xl': '64rem',
  		'6xl': '72rem',
  		'7xl': '80rem',
  		full: '100%'
  	},
  	fontSize: {
  		xs: '0.75rem',
  		sm: '0.875rem',
  		md: '1rem',
  		lg: '1.125rem',
  		xl: '1.25rem',
  		'2xl': '1.5rem',
  		'3xl': '1.875rem',
  		'4xl': '2.25rem',
  		'5xl': '3rem',
  		'6xl': '4rem'
  	},
  	extend: {
  		fontWeight: {
  			thin: 100,
  			extralight: 200,
  			light: 300,
  			normal: 400,
  			medium: 500,
  			semibold: 600,
  			bold: 700,
  			extrabold: 800,
  			black: 900
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
  			hide: {
  				from: {
  					opacity: '1'
  				},
  				to: {
  					opacity: '0'
  				}
  			},
  			slideIn: {
  				from: {
  					transform: 'translateX(calc(100% + var(--viewport-padding)))'
  				},
  				to: {
  					transform: 'translateX(0)'
  				}
  			},
  			swipeOut: {
  				from: {
  					transform: 'translateX(var(--radix-toast-swipe-end-x))'
  				},
  				to: {
  					transform: 'translateX(calc(100% + var(--viewport-padding)))'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.25s ease-out',
  			'accordion-up': 'accordion-up 0.25s ease-out',
  			hide: 'hide 100ms ease-in',
  			slideIn: 'slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)',
  			swipeOut: 'swipeOut 100ms ease-out'
  		},
  		colors: {
  			primary: {
  				'50': '#EDF2F7',
  				'100': '#E6F6FE',
  				'200': '#C0EAFC',
  				'300': '#9ADDFB',
  				'400': '#4FC3F7',
  				'500': '#03A9F4',
  				'600': '#0398DC',
  				'700': '#026592',
  				'800': '#014C6E',
  				'900': '#013349',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			gray: {
  				'100': '#f6f9fb ',
  				'200': '#edf2f7',
  				'300': '#e2e8f0',
  				'400': '#cbd5e0',
  				'500': '#a0aec0',
  				'600': '#718096',
  				'700': '#4a5568',
  				'800': '#2d3748',
  				'900': '#0a202c'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			accent1: '#97b6dd',
  			accent2: '#7ba0d6',
  			accent3: '#5f8bd0',
  			accent4: '#294e8a',
  			white: '#FFFFFF',
  			black: '#000000',
  			black1: '#1F1F1F',
  			black2: '#313131',
  			sage1: '#5C9C73',
  			sage2: '#72B68A',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		lineHeight: {
  			hero: '4.5rem'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms")],
  mode: "jit"
};