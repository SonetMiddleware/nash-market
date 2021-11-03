import { getOrderList, IOrderListItem } from '@/services';
import React, { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'umi';
import { Tag, Button, message, Popover } from 'antd';
import { ORDER_STATUS, SellTokenOptions } from '@/config';
import { useWeb3React } from '@web3-react/core';
import {
    useMarket,
    useMarketProxyWithoutRPC,
    useMeme2,
    useDealRouter,
} from '@/hooks/useContract';
import { ethers } from 'ethers';
import './index.less';
import useAuth from '@/hooks/useAuth';
import { ConnectorNames } from '@/utils/web3';
import {
    useCheckERC20ApprovalStatus,
    useERC20Approve,
} from '@/hooks/useApprove';
import { InfoCircleOutlined } from '@ant-design/icons';

export default (props: any) => {
    const { account } = useWeb3React();
    const [detail, setDetail] = useState<IOrderListItem>({});
    const [submitting, setSubmitting] = useState(false);
    const history = useHistory();
    const id = props.match.params.id;
    const dealRouter = useDealRouter();
    const market = useMarketProxyWithoutRPC();
    const { login, logout } = useAuth();

    const sellTokenAddress = useMemo(() => {
        return detail.sell_token || SellTokenOptions[0].value;
    }, [detail]);

    const { isApproved, setLastUpdated } = useCheckERC20ApprovalStatus(
        sellTokenAddress,
        dealRouter.address,
    );

    const { handleApprove, requestedApproval } = useERC20Approve(
        sellTokenAddress,
        dealRouter.address,
        setLastUpdated,
    );

    const fetchDetail = async () => {
        const res = await getOrderList({ order_id: id });
        if (res && res[0]) {
            setDetail(res[0]);
        }
    };

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
        fetchDetail();
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
            fetchDetail();
        } catch (err) {
            console.log(err);
            setSubmitting(false);
            message.error('Wallet issues/balance issue.');
        }
    };

    const statusText = useMemo(() => {
        if (detail.status === ORDER_STATUS.CREATED) {
            return 'On Sale';
        } else if (detail.status === ORDER_STATUS.ALL_SELLED) {
            return 'Sold';
        }
        return 'On Sale';
    }, [detail]);

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
                    <span className="tag-sale">{statusText}</span>
                </div>
                <div className="prices">
                    <p className="label">
                        <span> Price</span>
                        <Popover content="Dutch auction, the price gradually changes from Max to min over time">
                            <InfoCircleOutlined className="info-icon" />
                        </Popover>
                    </p>
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
                    {account && !isApproved && (
                        <Button
                            className="common-btn-primary submit-btn"
                            onClick={handleApprove}
                            loading={requestedApproval}
                        >
                            Approve to buy
                        </Button>
                    )}
                    {account && isApproved && (
                        <Button
                            className="common-btn-primary submit-btn"
                            onClick={handleBuy}
                            loading={submitting}
                            disabled={detail.status === 2}
                        >
                            Buy
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
