module.exports = {
    important: true,
    purge: {
        enabled: process.env.NODE_ENV === 'production',
        content: ['./src/**/*.{html,ts,scss}'],
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            backgroundImage: (theme) => ({
                // prettier-ignore
                "pattern": "url('./assets/img/bg-pattern.jpg')",
            }),
            gridRow: {
                'span-16': 'span 16 / span 16',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
