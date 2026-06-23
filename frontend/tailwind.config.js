/** @type {import('tailwindcss').Config} */
module.exports = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "surface-variant": "#e0e3e5",
                      "on-tertiary-fixed-variant": "#005236",
                      "surface-tint": "#0053db",
                      "on-primary-fixed-variant": "#003ea8",
                      "surface-dim": "#d8dadc",
                      "primary-container": "#2563eb",
                      "error-container": "#ffdad6",
                      "outline": "#737686",
                      "on-tertiary-fixed": "#002113",
                      "surface-bright": "#f7f9fb",
                      "surface-container": "#eceef0",
                      "on-tertiary": "#ffffff",
                      "secondary": "#565e74",
                      "on-error": "#ffffff",
                      "on-tertiary-container": "#bdffdb",
                      "secondary-fixed-dim": "#bec6e0",
                      "background": "#f7f9fb",
                      "inverse-primary": "#b4c5ff",
                      "secondary-container": "#dae2fd",
                      "primary": "#004ac6",
                      "surface-container-low": "#f2f4f6",
                      "on-secondary-container": "#5c647a",
                      "on-primary-container": "#eeefff",
                      "tertiary-fixed-dim": "#4edea3",
                      "on-error-container": "#93000a",
                      "on-secondary": "#ffffff",
                      "inverse-on-surface": "#eff1f3",
                      "tertiary-container": "#007d55",
                      "surface-container-high": "#e6e8ea",
                      "on-surface": "#191c1e",
                      "inverse-surface": "#2d3133",
                      "on-surface-variant": "#434655",
                      "on-secondary-fixed-variant": "#3f465c",
                      "on-background": "#191c1e",
                      "primary-fixed": "#dbe1ff",
                      "secondary-fixed": "#dae2fd",
                      "on-primary": "#ffffff",
                      "tertiary-fixed": "#6ffbbe",
                      "surface-container-highest": "#e0e3e5",
                      "error": "#ba1a1a",
                      "primary-fixed-dim": "#b4c5ff",
                      "on-secondary-fixed": "#131b2e",
                      "surface": "#f7f9fb",
                      "on-primary-fixed": "#00174b",
                      "outline-variant": "#c3c6d7",
                      "surface-container-lowest": "#ffffff",
                      "tertiary": "#006242"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "spacing": {
                      "margin-desktop": "2.5rem",
                      "stack-sm": "0.5rem",
                      "gutter": "1.5rem",
                      "stack-lg": "2rem",
                      "margin-mobile": "1rem",
                      "stack-md": "1rem",
                      "container-max": "1280px"
              },
              "fontFamily": {
                      "display-lg": ["Hanken Grotesk"],
                      "headline-xl": ["Hanken Grotesk"],
                      "body-md": ["Inter"],
                      "headline-xl-mobile": ["Hanken Grotesk"],
                      "label-sm": ["Inter"],
                      "body-lg": ["Inter"],
                      "headline-md": ["Hanken Grotesk"]
              },
              "fontSize": {
                      "display-lg": ["48px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                      "headline-xl": ["32px", {"lineHeight": "40px", "fontWeight": "700"}],
                      "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                      "headline-xl-mobile": ["24px", {"lineHeight": "32px", "fontWeight": "700"}],
                      "label-sm": ["14px", {"lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "600"}],
                      "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                      "headline-md": ["20px", {"lineHeight": "28px", "fontWeight": "600"}]
              }
            }
          },
  content: ["./src/**/*.{html,ts}"]
}