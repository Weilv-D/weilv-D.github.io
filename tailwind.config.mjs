/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',

	plugins: [
		require('@tailwindcss/typography'),
	],
    theme: {
		extend: {
			fontFamily: {
				sans: ['"Inter"', '"Noto Serif SC"', 'sans-serif'],
				serif: ['"Bodoni Moda"', '"Noto Serif SC"', '"Playfair Display"', 'serif'],
			},
            colors: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                accent: 'var(--color-accent)',
                background: 'var(--color-background)',
                surface: 'var(--color-surface)',
                text: 'var(--color-text)',
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        '--tw-prose-body': 'var(--color-text)',
                        '--tw-prose-headings': 'var(--color-primary)',
                        '--tw-prose-links': 'var(--color-primary)',
                        '--tw-prose-bold': 'var(--color-primary)',
                        '--tw-prose-counters': 'var(--color-secondary)',
                        '--tw-prose-bullets': 'var(--color-secondary)',
                        '--tw-prose-hr': 'var(--color-border)',
                        '--tw-prose-quotes': 'var(--color-primary)',
                        '--tw-prose-quote-borders': 'var(--color-accent)',
                        '--tw-prose-captions': 'var(--color-secondary)',
                        '--tw-prose-code': 'var(--color-primary)',
                        '--tw-prose-pre-code': 'var(--color-text)',
                        '--tw-prose-pre-bg': 'var(--color-surface)',
                        '--tw-prose-th-borders': 'var(--color-border)',
                        '--tw-prose-td-borders': 'var(--color-border)',
                        maxWidth: 'none',
                        lineHeight: '1.8',
                        p: {
                            marginTop: '1.5em',
                            marginBottom: '1.5em',
                        },
                        'h1, h2, h3': {
                            fontFamily: theme('fontFamily.serif'),
                            fontWeight: '700',
                            letterSpacing: '-0.025em',
                        },
                        blockquote: {
                            fontStyle: 'normal',
                            fontWeight: '400',
                            borderLeftWidth: '4px',
                            paddingLeft: '1.5em',
                            fontFamily: theme('fontFamily.serif'),
                            fontSize: '1.1em',
                        },
                        code: {
                            fontWeight: '500',
                            backgroundColor: 'var(--color-surface)',
                            padding: '0.2em 0.4em',
                            borderRadius: '0.25rem',
                            '&::before': { content: '""' },
                            '&::after': { content: '""' },
                        },
                    },
                },
            }),
		},
	},
}
