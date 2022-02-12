import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { getUserOwnedList, IOwnedListItem } from '@/services';
import { useWeb3React } from '@web3-react/core';
import {
    useMarketProxyWithoutRPC,
    useMeme2WithoutRPC,
} from '@/hooks/useContract';
import useWeb3Provider from '@/hooks/useWeb3Provider';
import './index.less';
import { Button, message, Modal, Select, Form, Input } from 'antd';
import Contracts from '@/config/constants/contracts';
import { ethers } from 'ethers';
import { expandTo18Decimals } from '@/utils/bigNumber';
import SellModal from './SellModal';
import TransferModal from './TransferModal';
const marketContract =
    Contracts.MarketProxyWithoutRPC[process.env.APP_CHAIN_ID];

export default () => {
    const { account } = useWeb3React();
    const meme2Contract = useMeme2WithoutRPC();
    const market = useMarketProxyWithoutRPC();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [sellToken, setSellToken] = useState('');
    const [selectedToken, setSelectedToken] = useState<IOwnedListItem>(null);
    const [favList, setFavList] = useState([]);
    const [isApproved, setIsApproved] = useState(false);
    const [form] = Form.useForm();
    const provider = useWeb3Provider();
    const [submitting, setSubmitting] = useState(false);
    const [transferring, setTransferring] = useState(false);
    const [transferModalVisible, setTransferModalVisible] = useState(false);

    const getIsApproved = async (tokenId) => {
        const approver = await meme2Contract.getApproved(
            ethers.BigNumber.from(tokenId),
        );
        const isApproveAll = await meme2Contract.isApprovedForAll(
            account,
            marketContract,
        );
        return approver === marketContract || isApproveAll;
    };

    const fetchOwnedList = async () => {
        const res = await getUserOwnedList({
            addr: account,
            contract:
                Contracts.PlatwinMEME2WithoutRPC[process.env.APP_CHAIN_ID],
        });
        // const resList = await Promise.all(res.map(item => meme2Contract.tokenURI(item.token_id)))
        const favList = res.map((item, index) => ({ ...item }));
        setFavList(favList);
        console.log(favList);
    };

    const handleSell = (token: IOwnedListItem) => {
        setSelectedToken(token);
        setIsModalVisible(true);
    };

    const handleTransfer = (token: IOwnedListItem) => {
        setSelectedToken(token);
        setTransferModalVisible(true);
    };

    const handleTransferOk = async (target: string) => {
        try {
            setTransferring(true);
            const tx = await meme2Contract.transferFrom(
                account,
                target,
                selectedToken.token_id,
            );
            const receipt = await tx.wait();
            console.log(receipt);
            message.success('Transfer NFT succeed!');
            fetchOwnedList();
            setTransferring(false);
            setTransferModalVisible(false);
        } catch (e) {
            console.log(e);
            message.error('Transfer NFT failed.');
            setTransferring(false);
        }
    };

    const handleOk = async () => {
        try {
            setSubmitting(true);
            const isApproved = await getIsApproved(selectedToken.token_id);
            console.log('isApproved: ', isApproved);
            if (!isApproved) {
                setSubmitting(false);
                return;
            }
            const values = await form.validateFields();
            console.log('Success:', values);
            let orderId;
            const contract =
                Contracts.PlatwinMEME2WithoutRPC[process.env.APP_CHAIN_ID];
            const minPrice = expandTo18Decimals(values.minPrice);
            const maxPrice = expandTo18Decimals(values.maxPrice);
            // let minPrice = ethers.BigNumber.from('100000000000000000000');
            // let maxPrice = minPrice;
            const sellToken = values.sellToken;
            let startBlock = ethers.BigNumber.from(
                (await provider.getBlockNumber()) + 10,
            );
            const duration = values.duration;
            const tokenId = ethers.BigNumber.from(selectedToken.token_id);
            const orderNum = await market.ordersNum();
            console.log(orderNum);

            //RPCRouter升级成DealRouter之后，用户挂单需要指定sell token的地址，测试可以先用TestERC20地址，或者ETH地址，先不要用RPC地址
            // 铸造的NFT不受影响，可以用之前的，也可以用新的PlatwinMEME2WithoutRPC，新的NFT不用花RPC
            const res = await market.makeOrder(
                true,
                contract,
                tokenId,
                1,
                sellToken,
                minPrice,
                maxPrice,
                startBlock,
                duration,
            );
            console.log(res);
            const resp = await res.wait(1);
            console.log(resp);
            const event = resp.events.find(
                (item) => item.address === marketContract,
            );
            if (event) {
                const orderId = event.args?.orderId;
                console.log('orderId: ', orderId);
            }
            message.success('Sell NFT succeed!');
            fetchOwnedList();
            setSubmitting(false);
            handleCancel();
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        setSelectedToken(null);
        setIsModalVisible(false);
        setSubmitting(false);
    };

    const handleApprove = async () => {
        try {
            setSubmitting(true);
            const tx = await meme2Contract.setApprovalForAll(
                marketContract,
                true,
            );
            await tx.wait();
            setIsApproved(true);
            setSubmitting(false);
        } catch (err) {
            console.log(err);
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (account) {
            fetchOwnedList();
        }
    }, [account]);

    useEffect(() => {
        if (selectedToken) {
            (async () => {
                const status = await getIsApproved(selectedToken.token_id);
                console.log('status: ', status);
                setIsApproved(status);
            })();
        } else {
            setIsApproved(false);
        }
    }, [selectedToken]);

    return (
        <div className="wallet-container">
            <p className="title">My NFTs:</p>
            <ul className="fav-list">
                {favList.map((item) => (
                    <li key={item.token_id} className="token-container">
                        <div className="img-container">
                            <img
                                src={`https://${item.uri}.ipfs.dweb.link/`}
                                alt=""
                            />
                        </div>

                        <div className="options">
                            <Button
                                onClick={() => handleSell(item)}
                                className="btn-sell"
                            >
                                Sell
                            </Button>
                            <Button
                                onClick={() => handleTransfer(item)}
                                className="btn-sell"
                            >
                                Transfer
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
            <Modal
                title="Sell NFT"
                className="sell-modal"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okButtonProps={{ disabled: !isApproved, loading: submitting }}
            >
                <SellModal
                    isApproved={isApproved}
                    handleApprove={handleApprove}
                    submitting={submitting}
                    selectedToken={selectedToken}
                    form={form}
                />
            </Modal>
            <TransferModal
                visible={transferModalVisible}
                onCancel={() => setTransferModalVisible(false)}
                onOk={handleTransferOk}
                selectedToken={selectedToken}
                transferring={transferring}
            />
        </div>
    );
};
