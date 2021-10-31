import { getOrderList, IOrderListItem } from '@/services';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'umi';
import { Tag, Button, message } from 'antd';
import { SellTokenOptions } from '@/config';
import { useWeb3React } from '@web3-react/core';
import {
    useMarket,
    useMarketProxyWithoutRPC,
    useMeme2,
} from '@/hooks/useContract';
import { ethers } from 'ethers';
import './index.less';
import useAuth from '@/hooks/useAuth';
import { ConnectorNames } from '@/utils/web3';

export default (props: any) => {
    const { account } = useWeb3React();
    const [detail, setDetail] = useState<IOrderListItem>({});
    const [submitting, setSubmitting] = useState(false);
    const history = useHistory();
    const id = props.match.params.id;
    const market = useMarketProxyWithoutRPC();
    const { login, logout } = useAuth();

    useEffect(() => {
        if (Number(id) === -1) {
            history.replace('/list');
            setTimeout(() => {
                message.info(
                    'The NFT has not been published to the marketplace. Feel free to surf the NFT marketplace for your favorite resources.',
                    6,
                );
            });
            return;
        }
        (async () => {
            const res = await getOrderList({ order_id: id });
            if (res && res[0]) {
                setDetail(res[0]);
            }
        })();
    }, []);

    const getTokenSymbol = (tokenAddress: string) => {
        if (!tokenAddress) return 'ETH';
        return SellTokenOptions.find((item) => item.value === tokenAddress)
            ?.label;
    };

    const handleConnect = () => {
        const connectorId = ConnectorNames.Injected;
        login(connectorId);
    };

    const handleBuy = async () => {
        try {
            setSubmitting(true);
            await market.takeOrder(id, 1);
            setSubmitting(false);
            message.success('Buy NFT succeed!');
        } catch (err) {
            console.log(err);
            setSubmitting(false);
            message.error('Wallet issues/balance issue.');
        }
    };

    return (
        <div className="detail-container">
            <div className="img-container">
                <img src={`https://${detail.uri}.ipfs.dweb.link/`} alt="" />
            </div>
            <div className="detail-info">
                <div className="tags">
                    <span className="tag-erc721">ERC721</span>
                    <span className="tag-hot">
                        <span>Hot</span>
                    </span>
                    <span className="tag-sale">On Sale</span>
                </div>
                <div className="prices">
                    <p className="label">Price</p>
                    <p>
                        <span>Min: </span>
                        {ethers.utils.formatEther(detail.min_price || 0)}{' '}
                        {getTokenSymbol(detail.sell_token)}
                    </p>
                    <p>
                        <span>Max: </span>
                        {ethers.utils.formatEther(detail.max_price || 0)}{' '}
                        {getTokenSymbol(detail.sell_token)}
                    </p>
                    {!account && (
                        <button
                            className="common-btn-primary submit-btn"
                            onClick={handleConnect}
                        >
                            Connect Wallet
                        </button>
                    )}
                    {account && (
                        <Button
                            className="common-btn-primary submit-btn"
                            onClick={handleBuy}
                            loading={submitting}
                        >
                            Buy
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
