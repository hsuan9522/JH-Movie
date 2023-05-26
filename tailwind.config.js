module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                gray: {
                    400: '#1c1d25',
                    500: '#121319',
                },
            },
            width: {
                50: '12.5rem',
            },
            height: {
                50: '12.5rem',
            },
        },
    },
    plugins: [],
}
