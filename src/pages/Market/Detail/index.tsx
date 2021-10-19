import { getOrderList, IOrderListItem } from '@/services';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'umi';
import { Tag, Button } from 'antd';
import { SellTokenOptions } from '@/config';
import { useWeb3React } from '@web3-react/core';
import { useMarket, useMeme2 } from '@/hooks/useContract';
import { ethers } from 'ethers';
import './index.less';
export default (props: any) => {
    const { account } = useWeb3React();
    const [detail, setDetail] = useState<IOrderListItem>({});
    const [isApproved, setIsApproved] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const history = useHistory();
    const id = props.match.params.id;
    const market = useMarket();

    useEffect(() => {
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

    const handleConnect = () => {};

    const handleApporve = async () => {};

    const handleBuy = async () => {
        try {
            setSubmitting(true);
        } catch (err) {
            console.log(err);
            setSubmitting(false);
        }
    };

    return (
        <div className="detail-container">
            <div className="img-container">
                <img src={`https://${detail.uri}.ipfs.dweb.link/`} alt="" />
            </div>
            <div className="detail-info">
                <div className="tags">
                    <Tag color="cyan">ERC721</Tag>
                    <Tag color="orange">Hot</Tag>
                    <Tag color="geekblue">On Sale</Tag>
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
                        <Button
                            className="btn-submit"
                            onClick={handleConnect}
                            type="primary"
                        >
                            Connect Wallet
                        </Button>
                    )}
                    {!isApproved && (
                        <Button
                            className="btn-submit"
                            onClick={handleApporve}
                            type="primary"
                        >
                            Buy
                        </Button>
                    )}
                    {account && isApproved && (
                        <Button
                            className="btn-submit"
                            onClick={handleBuy}
                            type="primary"
                        >
                            Buy
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
