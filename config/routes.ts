export default [
    {
        exact: false,
        path: '/',
        component: '@/layouts/index',
        routes: [
            { exact: true, path: '/', component: '@/pages/Market/List' },
            { exact: true, path: '/list', component: '@/pages/Market/List' },
            {
                exact: true,
                path: '/detail/:id',
                component: '@/pages/Market/Detail',
            },

            { exact: true, path: '/mint', component: '@/pages/Mint' },
            { exact: true, path: '/wallet', component: '@/pages/Wallet' },
        ],
    },
];
