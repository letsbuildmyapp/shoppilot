/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm off-white background — paper / linen
        bone: {
          50: "oklch(97% 0.012 88)",   // page background
          100: "oklch(95% 0.016 88)",  // subtle surfaces
          200: "oklch(91% 0.020 86)",  // hovers
        },
        // Deep forest green — primary
        forest: {
          DEFAULT: "oklch(34% 0.060 155)",
          deep: "oklch(26% 0.055 155)",
          soft: "oklch(48% 0.075 155)",
        },
        // Sage — secondary
        sage: {
          DEFAULT: "oklch(72% 0.040 145)",
          soft: "oklch(82% 0.025 145)",
        },
        // Charcoal text
        coal: {
          DEFAULT: "oklch(22% 0.012 60)",
          soft: "oklch(34% 0.010 60)",
          // Muted — pushed dark enough for AA on bone-50
          mute: "oklch(44% 0.010 60)",
        },
        line: "oklch(86% 0.010 75)",
        clay: "oklch(56% 0.085 50)", // accent for sale tags
      },
      fontFamily: {
        serif: ['"Cardo"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', '"Cardo"', 'Georgia', 'serif'],
        sans: ['"Geist"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        caption: ["12px", { lineHeight: "16px" }],
        footnote: ["13px", { lineHeight: "18px" }],
        subheadline: ["15px", { lineHeight: "20px" }],
        body: ["16px", { lineHeight: "24px" }],
        headline: ["17px", { lineHeight: "22px", fontWeight: "600" }],
        title3: ["20px", { lineHeight: "26px" }],
        title2: ["22px", { lineHeight: "28px" }],
        title1: ["28px", { lineHeight: "34px" }],
        largeTitle: ["34px", { lineHeight: "41px" }],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      maxWidth: {
        prose: "65ch",
      },
      borderRadius: {
        none: "0px",
      },
      boxShadow: {
        panel: "0 1px 0 rgba(0,0,0,0.04), 0 8px 32px -16px rgba(31,59,44,0.18)",
      },
    },
  },
  plugins: [],
};
