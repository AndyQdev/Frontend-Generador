/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      // colors: {
      //   // Colores claros
      //   danger: '#f44250',
      //   success: '#6bd968',
      //   warning: '#fecc1b',
      //   process: '#3992ff',
      //   // button action
      //   // light mode
      //   'light-primary': '#fc5185',
      //   'light-secondary': '#f4f4f5',

      //   'light-text-primary': '#3A3541',
      //   'light-text-secondary': '#71717A',
      //   'light-bg-primary': '#FFFFFF', //Background white
      //   'light-bg-secondary': '#f4f4f5',// backgroun del main
      //   'light-border': '#e4e4e7',
      //   'light-action': '#18181B',
      //   'light-action-hover': '#18181be6',
      //   'light-hover': '#6FF3B1',
        
      //   // dark mode
      //   'dark-text-primary': '#FAFAFA',
      //   'dark-text-secondary': '#A1A1AA',
      //   'dark-bg-primary': '#09090b',
      //   'dark-bg-secondary': '#151518',
      //   'dark-border': '#b8c0cc33',
      //   'dark-action': '#FAFAFA',
      //   'dark-action-hover': '#fafafae6',
      // },
      colors: {
        // Mapeo de las variables de Shadcn/ui + tus charts:
        'light-bg-secondary': '#f4f4f5',
        'light-bg-main': '#f4f4f5',
        'light-primary': '#2563eb',
        'light-secondary': '#f4f4f5',
        'dark-bg-primary': '#020817',
        'dark-bg-secondary': '#09090b',
        'dark-background-primary': '#111827',
        'dark-black': '#09090b',
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // Charts (si los necesitas)
        "chart-1": "hsl(var(--chart-1))",
        "chart-2": "hsl(var(--chart-2))",
        "chart-3": "hsl(var(--chart-3))",
        "chart-4": "hsl(var(--chart-4))",
        "chart-5": "hsl(var(--chart-5))",
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}