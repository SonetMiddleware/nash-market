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
const marketContract =
    Contracts.MarketProxyWithoutRPC[process.env.APP_CHAIN_ID];
import { SellTokenOptions } from '@/config';
const { Option } = Select;

export default () => {
    const { account } = useWeb3React();
    const meme2Contract = useMeme2WithoutRPC();
    const market = useMarketProxyWithoutRPC();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedToken, setSelectedToken] = useState<IOwnedListItem>(null);
    const [sellToken, setSellToken] = useState('');
    const [favList, setFavList] = useState([]);
    const [isApproved, setIsApproved] = useState(false);
    const [form] = Form.useForm();
    const provider = useWeb3Provider();
    const [submitting, setSubmitting] = useState(false);

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
                (await provider.getBlockNumber()) + 100,
            );
            let duration = 100;
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
    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
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
                <div className="sell-container">
                    <div className="sell-img-container">
                        <img
                            src={`https://${selectedToken?.uri}.ipfs.dweb.link/`}
                            alt=""
                        />
                    </div>
                    <div className="sell-form">
                        {!isApproved && (
                            <div style={{ marginBottom: 15 }}>
                                <Button
                                    type="primary"
                                    className="common-btn-primary btn-approve"
                                    onClick={handleApprove}
                                    loading={submitting}
                                >
                                    Approve to sell
                                </Button>
                            </div>
                        )}
                        <Form
                            form={form}
                            name="basic"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Sell token"
                                name="sellToken"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select sell token!',
                                    },
                                ]}
                            >
                                <Select className="sell-form-input">
                                    {SellTokenOptions.map((item) => (
                                        <Option value={item.value}>
                                            {item.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Min price"
                                name="minPrice"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input min price!',
                                    },
                                ]}
                            >
                                <Input className="sell-form-input" />
                            </Form.Item>
                            <Form.Item
                                label="Max price"
                                name="maxPrice"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input max price!',
                                    },
                                ]}
                            >
                                <Input className="sell-form-input" />
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
