/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      // 🟢 1. YOUR NEW PRAVA SYSTEM
      colors: {
        bg: {
          app: "hsl(var(--bg-app))",
          surface: "hsl(var(--bg-surface))",
          elevated: "hsl(var(--bg-surface-elevated))",
        },
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          tertiary: "hsl(var(--text-tertiary))",
          disabled: "hsl(var(--text-disabled))",
        },
        border: {
          subtle: "hsl(var(--border-subtle))",
          muted: "hsl(var(--border-muted))",
        },
        brand: {
          primary: "hsl(var(--brand-primary))",
          soft: "hsl(var(--brand-soft))",
          ring: "hsl(var(--brand-ring))", // Added for input focus
        },
        state: {
          danger: "hsl(var(--state-danger))",
          success: "hsl(var(--state-success))",
          warning: "hsl(var(--state-warning))",
        },

        // 🟡 2. COMPATIBILITY BRIDGE (Keeps existing pages working)
        // These map standard classes (bg-background) to your new vars
        background: "hsl(var(--bg-app))",
        foreground: "hsl(var(--text-primary))",
        primary: {
          DEFAULT: "hsl(var(--brand-primary))",
          foreground: "hsl(var(--brand-on-primary))",
        },
        secondary: {
          DEFAULT: "hsl(var(--bg-surface-elevated))",
          foreground: "hsl(var(--text-primary))",
        },
        muted: {
          DEFAULT: "hsl(var(--bg-surface-elevated))",
          foreground: "hsl(var(--text-secondary))",
        },
        accent: {
          DEFAULT: "hsl(var(--brand-soft))",
          foreground: "hsl(var(--brand-primary))",
        },
        destructive: {
          DEFAULT: "hsl(var(--state-danger))",
          foreground: "hsl(0 0% 98%)",
        },
        card: {
          DEFAULT: "hsl(var(--bg-surface))",
          foreground: "hsl(var(--text-primary))",
        },
        border: "hsl(var(--border-subtle))",
        input: "hsl(var(--border-muted))",
        ring: "hsl(var(--brand-ring))",
      },
      
      // 🟢 3. YOUR PHYSICS & SHAPES
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
        luxury: "var(--ease-luxury)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}