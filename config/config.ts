import { defineConfig } from 'umi';
import routes from './routes';
export default defineConfig({
    favicon: 'favicon.ico',

    nodeModulesTransform: {
        type: 'none',
    },
    routes,
    fastRefresh: {},
    locale: {},
    links: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: true,
        },
        {
            href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap',
            rel: 'stylesheet',
        },
    ],
});
