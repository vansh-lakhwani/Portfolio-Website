import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core surfaces
        background:  '#0A0F1E',
        surface:     '#0E1322',
        card:        '#111827',
        'card-low':  '#161B2B',
        'card-mid':  '#1A1F2F',
        'card-high': '#25293A',
        'card-top':  '#2F3445',

        // Accents
        mint:        '#5DCAA5',
        'mint-dim':  '#7AE6C0',
        purple:      '#7F77DD',
        'purple-dim':'#C5C0FF',
        coral:       '#FFC6B8',

        // Text
        text:        '#E8EDF5',
        'text-dim':  '#DEE1F7',
        muted:       '#8892A4',
        'on-mint':   '#003829',

        // Borders / misc
        outline:     '#87948D',
        'outline-var':'#3D4944',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3.5rem',  { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['2.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-sm': ['2rem',    { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg:  '12px',
        xl:  '16px',
        '2xl': '24px',
        full: '9999px',
      },
      backdropBlur: {
        glass: '12px',
      },
      boxShadow: {
        glow:  '0 0 20px rgba(93,202,165,0.4)',
        float: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(93,202,165,0.05)',
        card:  '0 4px 24px rgba(0,0,0,0.3)',
      },
      backgroundImage: {
        'mint-gradient':   'linear-gradient(135deg, #5DCAA5, #7AE6C0)',
        'purple-gradient': 'linear-gradient(135deg, #7F77DD, #C5C0FF)',
        'hero-glow':       'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(93,202,165,0.15), transparent)',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease-out forwards',
        'fade-in':    'fadeIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      spacing: {
        section: '96px',
        18:      '4.5rem',
        22:      '5.5rem',
      },
    },
  },
  plugins: [],
}

export default config
