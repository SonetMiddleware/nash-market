import { defineConfig } from 'umi';

export default defineConfig({
    define: {
        'process.env.RPC_NODE_1': 'https://rpc-mumbai.maticvigil.com',
        'process.env.RPC_NODE_2': 'https://rpc-mumbai.maticvigil.com',
        'process.env.RPC_NODE_3': 'https://rpc-mumbai.maticvigil.com',
        'process.env.APP_CHAIN_ID': '80001', //'97',
    },
});
