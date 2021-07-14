export default [
  {
    exact: false,
    path: '/',
    component: '@/layouts/index',
    routes: [
      { exact: true, path: '/', component: '@/pages/Market' },
      { exact: true, path: '/mint', component: '@/pages/Mint' },
      { exact: true, path: '/wallet', component: '@/pages/Wallet' },
    ],
  },
];
