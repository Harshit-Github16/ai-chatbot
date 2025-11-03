module.exports = {
    content: [
        "./pages/*.{html,js}",
        "./index.html",
        "./*.html",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#F5F3FF", // lavender-50
                    100: "#EDE9FE", // lavender-100
                    200: "#DDD6FE", // lavender-200
                    300: "#C4B5FD", // lavender-300
                    400: "#A78BFA", // lavender-400
                    500: "#8B7ED8", // lavender-500
                    600: "#7C3AED", // lavender-600
                    700: "#6D28D9", // lavender-700
                    800: "#5B21B6", // lavender-800
                    900: "#4C1D95", // lavender-900
                    DEFAULT: "#8B7ED8", // lavender-500
                },
                secondary: {
                    50: "#F0F9FF", // pastel-blue-50
                    100: "#E0F2FE", // pastel-blue-100
                    200: "#BAE6FD", // pastel-blue-200
                    300: "#7DD3FC", // pastel-blue-300
                    400: "#38BDF8", // pastel-blue-400
                    500: "#A8D8EA", // pastel-blue-500
                    600: "#0284C7", // pastel-blue-600
                    700: "#0369A1", // pastel-blue-700
                    800: "#075985", // pastel-blue-800
                    900: "#0C4A6E", // pastel-blue-900
                    DEFAULT: "#A8D8EA", // pastel-blue-500
                },
                accent: {
                    50: "#FFF7ED", // warm-peach-50
                    100: "#FFEDD5", // warm-peach-100
                    200: "#FED7AA", // warm-peach-200
                    300: "#FDBA74", // warm-peach-300
                    400: "#FB923C", // warm-peach-400
                    500: "#FFB5A7", // warm-peach-500
                    600: "#EA580C", // warm-peach-600
                    700: "#C2410C", // warm-peach-700
                    800: "#9A3412", // warm-peach-800
                    900: "#7C2D12", // warm-peach-900
                    DEFAULT: "#FFB5A7", // warm-peach-500
                },
                background: "#FEFEFE", // clean-white
                surface: "#F8F9FF", // subtle-lavender
                text: {
                    primary: "#2D3748", // gray-800
                    secondary: "#718096", // gray-500
                },
                success: "#68D391", // green-400
                warning: "#F6AD55", // orange-400
                error: "#FC8181", // red-400
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
                poppins: ['Poppins', 'sans-serif'],
            },
            fontWeight: {
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
            },
            boxShadow: {
                glassmorphism: '0 8px 32px rgba(139, 126, 216, 0.1)',
            },
            borderColor: {
                subtle: 'rgba(139, 126, 216, 0.1)',
            },
            backgroundImage: {
                'gradient-therapeutic': 'linear-gradient(135deg, #C4B5FD 0%, #7DD3FC 100%)',
            },
            transitionDuration: {
                smooth: '250ms',
            },
            transitionTimingFunction: {
                smooth: 'ease-in-out',
            },
        },
    },
    plugins: [],
}