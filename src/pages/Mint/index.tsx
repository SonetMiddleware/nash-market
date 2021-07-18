import React, { useState, useEffect } from 'react';
import { Input, Button, message, Spin } from 'antd';
import { useWeb3React } from '@web3-react/core';
import { useRpcRouter, useCash, useMeme2 } from '@/hooks/useContract';
import Contracts from '@/config/constants/contracts';
import { ethers } from 'ethers';
import './index.less';
import { addUserFav } from '@/services'

export default (props: any) => {
    const { account } = useWeb3React();
    const [hash, setHash] = useState('');
    const [tokenId, setTokenId] = useState('')
    const [loading, setLoading] = useState(false)

    const cashContract = useCash();
    const meme2Contract = useMeme2();
    const rpcRouterContract = useRpcRouter();

    console.log(account)

    useEffect(() => {
        console.log(props.location.query);
        const { hash } = props.location.query;
        setHash(hash);
    }, [props.location]);

    const onSubmit = async () => {
        if (!hash) {
            message.warning('IPFS hash is required');
            return;
        }
        if (!account) {
            return;
        }
        try {
            setLoading(true)
            const mintFee = await rpcRouterContract.fixedAmountFee(
                Contracts.PlatwinMEME2[process.env.APP_CHAIN_ID],
            );
            console.log('mintFee', mintFee);
            if (mintFee[0].lt(0)) {
                const allowance = await cashContract.allowance(
                    account,
                    Contracts.RPCRouter[process.env.APP_CHAIN_ID],
                );
                console.log('allowance', allowance);

                if (allowance.lt(mintFee)) {
                    await cashContract.approve(
                        Contracts.RPCRouter[process.env.APP_CHAIN_ID],
                        ethers.constants.MaxUint256,
                    );
                }
            }

            const res = await meme2Contract.mint(account, hash)
            meme2Contract.on('Transfer', (from, to, value, event) => {
                console.log(event)
                if (event.address === Contracts.PlatwinMEME2[process.env.APP_CHAIN_ID]) {
                    const tokenId = event.args['tokenId'].toString()
                    setTokenId(tokenId)
                    setLoading(false)
                    message.success('Congrats! Your NFT is minted successfully!')
                    const data = {
                        addr: account,
                        contract: Contracts.PlatwinMEME2[process.env.APP_CHAIN_ID],
                        token_id: tokenId,
                        fav: 1
                    }
                    addUserFav(data).then(res => {
                        console.log(res)
                    })
                }
            });
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    };

    return (
        <Spin spinning={loading}>
            <div className="mint-container">
                <div className="input-item">
                    <p className="label">IPFS Hash:</p>
                    <Input
                        className="custom-input"
                        value={hash}
                        onChange={(e) => setHash(e.target.value)}
                        placeholder="Please input the ipfs hash of your NFT"
                    ></Input>
                    {tokenId && <p className="label">Your NFT token id: {tokenId}</p>}
                </div>
                <Button type="primary" onClick={onSubmit} className="btn-submit">
                    Submit
                </Button>
            </div>
        </Spin>
    );
};
