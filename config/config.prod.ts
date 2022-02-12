import { defineConfig } from 'umi';

export default defineConfig({
    hash: true,
    headScripts: [
        'https://unpkg.com/react@17/umd/react.production.min.js',
        'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
    ],
    externals: {
        react: 'window.React',
        'react-dom': 'window.ReactDOM',
    },
    define: {
        'process.env.RPC_NODE_1': 'https://rpc-mumbai.maticvigil.com',
        'process.env.RPC_NODE_2': 'https://rpc-mumbai.maticvigil.com',
        'process.env.RPC_NODE_3': 'https://rpc-mumbai.maticvigil.com',
        'process.env.APP_CHAIN_ID': '80001', //'97',
    },
});
