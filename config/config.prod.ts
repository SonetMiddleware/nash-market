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
});
