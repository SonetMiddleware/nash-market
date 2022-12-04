import React, { useState, useEffect } from 'react';
//@ts-ignore
import * as fcl from '@onflow/fcl';
import './index.less';
import { useLocation } from 'umi';

export default () => {
    let currentUserRes;
    const location = useLocation();
    console.log(location.search);
    const signMessage = async (data: string) => {
        const MSG = Buffer.from(data).toString('hex');
        try {
            const res = await fcl.currentUser.signUserMessage(MSG);
            console.log('sign: ', JSON.stringify(res));
            // fcl.config()
            //     .put('flow.network', 'testnet')
            //     .put('challenge.scope', 'email') // request for Email
            //     .put('accessNode.api', 'https://rest-testnet.onflow.org'); // Flow testnet
            // const isValid = await fcl.AppUtils.verifyUserSignatures(
            //     MSG,
            //     res,
            //     {},
            // );
            // console.log('isValid: ', isValid);
            const result = {
                type: 'sign',
                data: res,
            };
            window.parent.postMessage(JSON.stringify(result), '*');
        } catch (error) {
            console.log(error);
        }
    };
    async function loginFLow() {
        // fcl.currentUser().subscribe((userRes: any) => {
        //     console.log(userRes);
        //     currentUserRes = userRes;
        // }); // fires everytime account connection status updates
        fcl.authenticate().then((res: any) => {
            console.log(res);
            const result = {
                type: 'login',
                data: res,
            };
            window.parent.postMessage(JSON.stringify(result), '*');
        });
    }
    const messageHandler = (e) => {
        console.log('msg from parent: ', e.data, e.origin);
        if (
            e.origin === 'chrome-extension://jacldgpgaicmleplokmnelcfgdplfkoh'
        ) {
            try {
                const res: { type: string; data?: string } = JSON.parse(e.data);
                if (res.type === 'login') {
                    loginFLow();
                } else if (res.type === 'sign') {
                    signMessage(res.data);
                }
            } catch (e) {
                console.log(e);
            }
        }
    };
    useEffect(() => {
        //@ts-ignore
        const { network } = location.query;
        fcl.config()
            .put('challenge.scope', 'email') // request for Email
            .put(
                'accessNode.api',
                network === 'mainnet'
                    ? 'https://rest-mainnet.onflow.org'
                    : 'https://rest-testnet.onflow.org',
            ) // Flow testnet
            .put(
                'discovery.wallet',

                network === 'mainnet'
                    ? 'https://flow-wallet.blocto.app/authn'
                    : 'https://flow-wallet-testnet.blocto.app/authn',
            ) // Blocto testnet wallet
            // .put(
            //     'discovery.wallet',
            //     'https://fcl-discovery.onflow.org/testnet/authn',
            // )
            .put('service.OpenID.scopes', 'email!')
            .put('app.detail.icon', '')
            .put('app.detail.title', 'Soda')
            .put('app.detail.url', 'www.soda.com')
            .put('flow.network', network);

        window.addEventListener('message', messageHandler);
        return () => {
            window.removeEventListener('message', messageHandler);
        };
    }, [location]);

    return (
        <div className="flow-sign-container">
            <h1>Sign message with Flow wallet</h1>
        </div>
    );
};
