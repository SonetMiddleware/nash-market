import { getOrderList, IOrderListItem } from '@/services';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'umi';
import { Tag, Button } from 'antd';
import { SellTokenOptions } from '@/config';
import { useWeb3React } from '@web3-react/core';
import { useMarket, useMeme2 } from '@/hooks/useContract';

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
            <img src={`https://${detail.uri}.ipfs.dweb.link/`} alt="" />
            <div className="detail-info">
                <div className="tags">
                    <Tag color="cyan">ERC721</Tag>
                    <Tag color="blue">Hot</Tag>
                    <Tag color="geekblue">On Sale</Tag>
                </div>
                <div className="prices">
                    <p className="lable">Price</p>
                    <p>
                        <span>Min: </span>
                        {detail.min_price} {getTokenSymbol(detail.sell_token)}
                    </p>
                    <p>
                        <span>Max: </span>
                        {detail.max_price} {getTokenSymbol(detail.sell_token)}
                    </p>
                    {!account && (
                        <Button className="btn-submit" onClick={handleConnect}>
                            Connect Wallet
                        </Button>
                    )}
                    {!isApproved && (
                        <Button className="btn-submit" onClick={handleApporve}>
                            Approve to buy
                        </Button>
                    )}
                    {account && isApproved && (
                        <Button className="btn-submit" onClick={handleBuy}>
                            Buy
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
