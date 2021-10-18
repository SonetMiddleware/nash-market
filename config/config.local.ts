import { defineConfig } from 'umi';

export default defineConfig({
    define: {
        'process.env.RPC_NODE_1':
            'https://data-seed-prebsc-1-s1.binance.org:8545/',

        'process.env.RPC_NODE_2':
            'https://data-seed-prebsc-2-s1.binance.org:8545/',

        'process.env.RPC_NODE_3':
            'https://data-seed-prebsc-1-s2.binance.org:8545/',

        'process.env.APP_CHAIN_ID': '80001', //'97',
    },
    //TODO 部署时解决跨域问题
    // proxy: {
    //     '/api/v1': {
    //         target: 'https://testapi.platwin.io/',
    //         changeOrigin: true,
    //     },
    // },
});
