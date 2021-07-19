module.exports = {
    purge: [
        './pages/**/*.js',
        './components/**/*.js',
    ],
    theme: {
        extend: {
            colors: {
                'header-background-color': 'var(--header-background-color)',
            },
            textColor: {
                primary: 'var(--color-text-primary)',
                secondary: 'var(--color-text-secondary)',
                'link-primary': 'var(--color-text-link-primary)',
                'link-secondary': 'var(--color-text-link-secondary)',
                error: 'var(--color-text-error)',
                success: 'var(--color-text-success)',
                title: 'var(--color-text-title)',
                disable: 'var(--color-text-disable)',
            },
            backgroundColor: {
                primary: 'var(--color-background-primary)',
                secondary: 'var(--color-background-secondary)',
                success: 'var(--color-background-success)',
                highlight: 'var(--color-background-highlight)',
                light: 'var(--color-background-light)',
                active: 'var(--color-background-active)',
                default: 'var(--color-background-default)',
                'default-dark': 'var(--color-background-default-dark)',
            },
            placeholderColor: {
                primary: 'var(--color-placeholder-primary)',
            },
            borderColor: {
                primary: 'var(--color-border-primary)',
                secondary: 'var(--color-border-secondary)',
                light: 'var(--color-border-light)',
                error: 'var(--color-border-error)',
                dark: 'var(--color-border-dark)',
            },
            fontSize: {
                '2xs': ['var(--size-font-2xs)', 'var(--line-height-2xs)'],
                xs: ['var(--size-font-xs)', 'var(--line-height-xs)'],
                sm: ['var(--size-font-sm)', 'var(--line-height-sm)'],
                base: ['var(--size-font-base)', 'var(--line-height-base)'],
                lg: ['var(--size-font-lg)', 'var(--line-height-lg)'],
                xl: ['var(--size-font-xl)', 'var(--line-height-xl)'],
                '2xl': ['var(--size-font-2xl)', 'var(--line-height-2xl)'],
            },
            lineHeight: {
                '2xs': 'var(--line-height-2xs)',
                xs: 'var(--line-height-xs)',
                sm: 'var(--line-height-sm)',
                base: 'var(--line-height-base)',
                lg: 'var(--line-height-lg)',
                xl: 'var(--line-height-xl)',
                '2xl': 'var(--line-height-2xl)',
            },
            screens: {
                sm: '40rem', // 640px
                md: '48rem', // 768px
                lg: '76.5rem', // 1080px
                xl: '85.375rem', // 1366px
            },
            fontFamily: {
                'family-regular': 'var(--font-family-regular)',
                'family-semi-bold': 'var(--font-family-semi-bold)',
                'family-bold': 'var(--font-family-bold)',
                'family-light': 'var(--font-family-light)',
                'family-italic': 'var(--font-family-italic)',
                'family-bold-italic': 'var(--font-family-bold-italic)',
                'family-black': 'var(--font-family-black)',
                'family-black-italic': 'var(--font-family-black-italic)',
                'family-light-italic': 'var(--font-family-light-italic)',
                'family-thin-italic': 'var(--font-family-thin-italic)',
                'family-medium-italic': 'var(--font-family-medium-italic)',
                'family-thin': 'var(--font-family-thin)',
                sans: ['var(--font-family-regular)', 'var(--font-family-sans)'],
                serif: ['var(--font-family-regular)', 'var(--font-family-serif)'],
                mono: ['var(--font-family-regular)', 'var(--font-family-mono)'],
            },
            boxShadow: {
                primary: '0px 6px 12px var(--color-shadow-primary)',
                secondary: '0px 6px 12px var(--color-shadow-secondary)',
            },
            height: {
                '60': '15rem',
                '96': '24rem',
            },
            width: {
                'input-width': 'var(--input-width)',
                'select-width': 'var(--select-width)',
                'textarea-width': 'var(--textarea-width)',
                'footer-md-width': 'var(--footer-md-width)',
                '60': '15rem',
                '96': '24rem',
            },
            spacing: {
                'checkbox-padding': 'var(--checkbox-padding)',
                'checkbox-margin': 'var(--checkbox-margin)',
                'radio-padding': 'var(--radio-padding)',
                'radio-margin': 'var(--radio-margin)',
                '60': '15rem',
                '96': '24rem',
            },
        },
    },
    variants: {},
    plugins: [],
};
