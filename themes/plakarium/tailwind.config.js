console.log("Tailwind config bien chargée ✅");

import fluid, { extract, screens, fontSize } from 'fluid-tailwind'
import typography from '@tailwindcss/typography'

module.exports = {
    content: {
        files: [
        './themes/plakarium/layouts/**/*.html',
        './themes/plakarium/content/**/*.md',
        './themes/plakarium/assets/**/*.js',
        './layouts/**/*.html',
        './content/**/*.md'],
        extract,
    },
    safelist: ['bg-neutral-100'],
    theme: {
        screens, // Tailwind's default screens, in `rem`
        fontSize, // Tailwind's default font sizes, in `rem` (including line heights)
        extend: {
            fontSize: {
                'xxs': '0.625rem', // 10px
            },
            fontFamily: {
                'dm-mono': ['"DM Mono"', 'monospace'],
                'space-text': ['"Space Text"', 'sans-serif'],
                'space-grotesk': ['"Space Grotesk"', 'sans-serif'],
                'prose': ['"Source Serif 4"', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
            },
            colors: {
                primary: {
                    50: '#F0F0FF',
                    100: '#DAD9FF',
                    200: '#B3B1FF',
                    300: '#8D88FF',
                    350: '#9895FF',
                    400: '#6760FF',
                    500: '#524CFF',
                    600: '#3E38EA',
                    700: '#2E2C99',
                    800: '#1F1F66',
                    900: '#111133',
                },
                secondary: {
                    50:  '#FFF5F0',  // very light background
                    100: '#FFEBD8',  // light pastel background (requested)
                    200: '#FFD1A8',  // soft orange transition
                    300: '#FFB178',  // warm intermediate
                    400: '#FF9C41',  // vivid orange (requested)
                    500: '#FF8547',  // main secondary color (historical)
                    600: '#F76635',  // intense orange-red (requested)
                    700: '#D94F2C',  // deeper strong accent
                    800: '#7A2719',  // dark orange-brown
                    900: '#40130C',  // very dark background
                },
                neutral: {
                    50:  '#FFFFFF',
                    100: '#F5F4FB',
                    200: '#E7E6F0',
                    300: '#DCD9E3',
                    400: '#B2B1C7',
                    500: '#9291B0',
                    600: '#6D6C8D',
                    700: '#4F4E66',
                    800: '#2D2C3A',
                    900: '#1C1C1E',
                },
            },
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        "--tw-prose-body": theme("colors.neutral.700 / 1"),
                        "--tw-prose-headings": theme("colors.neutral.800 / 1"),
                        "--tw-prose-lead": theme("colors.neutral.500 / 1"),
                        "--tw-prose-links": theme("colors.primary.600 / 1"),
                        "--tw-prose-bold": theme("colors.neutral.900 / 1"),
                        "--tw-prose-counters": theme("colors.neutral.800 / 1"),
                        "--tw-prose-bullets": theme("colors.neutral.500 / 1"),
                        "--tw-prose-hr": theme("colors.neutral.200 / 1"),
                        "--tw-prose-quotes": theme("colors.neutral.700 / 1"),
                        "--tw-prose-quote-borders": theme("colors.primary.200 / 1"),
                        "--tw-prose-captions": theme("colors.neutral.500 / 1"),
                        "--tw-prose-th-borders": theme("colors.neutral.500 / 1"),
                        "--tw-prose-td-borders": theme("colors.neutral.300 / 1"),
                        "--tw-prose-invert-body": theme("colors.neutral.300 / 1"),
                        "--tw-prose-invert-headings": theme("colors.neutral.50 / 1"),
                        "--tw-prose-invert-lead": theme("colors.neutral.500 / 1"),
                        "--tw-prose-invert-links": theme("colors.primary.400 / 1"),
                        "--tw-prose-invert-bold": theme("colors.neutral.DEFAULT / 1"),
                        "--tw-prose-invert-counters": theme("colors.neutral.400 / 1"),
                        "--tw-prose-invert-bullets": theme("colors.neutral.600 / 1"),
                        "--tw-prose-invert-hr": theme("colors.neutral.500 / 1"),
                        "--tw-prose-invert-quotes": theme("colors.neutral.200 / 1"),
                        "--tw-prose-invert-quote-borders": theme("colors.primary.900 / 1"),
                        "--tw-prose-invert-captions": theme("colors.neutral.400 / 1"),
                        "--tw-prose-invert-code": theme("colors.secondary.400 / 1"),
                        "--tw-prose-invert-th-borders": theme("colors.neutral.500 / 1"),
                        "--tw-prose-invert-td-borders": theme("colors.neutral.700 / 1"),
                        a: {
                            textDecoration: "none",
                            textDecorationColor: theme("colors.primary.300 / 1"),
                            fontWeight: "500",
                            "&:hover": {
                                color: theme("colors.primary.600 / 1"),
                                textDecoration: "none",
                                borderRadius: "0.09rem",
                            },
                        },
                        "a code": {
                            color: "var(--tw-prose-code)",
                        },
                        kbd: {
                            backgroundColor: theme("colors.neutral.200 / 1"),
                            padding: "0.1rem 0.4rem",
                            borderRadius: "0.25rem",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                        },
                        mark: {
                            color: theme("colors.neutral.800 / 1"),
                            backgroundColor: theme("colors.primary.600 / 1"),
                            padding: "0.1rem 0.2rem",
                            borderRadius: "0.25rem",
                        },
                        'pr code': {
                            paddingTop: "3px",
                            paddingBottom: "3px",
                            paddingLeft: "5px",
                            paddingRight: "5px",
                            borderRadius: "0.25rem",
                        },
                        'code::before': {
                            display: 'none'
                        },
                        'code::after': {
                            display: 'none'
                        },
                        'p::before': {
                            display: 'none'
                        },
                        'p::after': {
                            display: 'none'
                        },
                        'a.active': {
                            "text-decoration-color": theme("colors.primary.600 / 1"),
                        },
                        'p.active': {
                            "text-decoration-color": theme("colors.primary.600 / 1"),
                        }
                    },
                },
                invert: {
                    css: {
                        a: {
                            textDecorationColor: theme("colors.neutral.600 / 1"),
                            "&:hover": {
                                color: theme("colors.primary.400 / 1"),
                            },
                        },
                        kbd: {
                            color: theme("colors.neutral.200 / 1"),
                            backgroundColor: theme("colors.neutral.700 / 1"),
                        },
                        mark: {
                            backgroundColor: theme("colors.primary.400 / 1"),
                        },
                        code:{
                            backgroundColor: theme("colors.neutral.700 / 1"),
                        },
                        'a.active': {
                            "text-decoration-color": theme("colors.primary.400 / 1")
                        },
                        'p.active': {
                            "text-decoration-color": theme("colors.primary.400 / 1")
                        }
                    },
                },
            }),
        },
    },
    plugins: [
        typography,
        fluid
    ],
}
