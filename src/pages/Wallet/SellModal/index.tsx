import React, { useState } from 'react';
import './index.less';
import { Button, message, Modal, Select, Form, Input } from 'antd';
import { SellTokenOptions } from '@/config';
import { InfoCircleOutlined } from '@ant-design/icons';
import { IOwnedListItem } from '@/services';

const { Option } = Select;
interface IProps {
    isApproved: boolean;
    handleApprove: () => void;
    submitting: boolean;
    selectedToken: IOwnedListItem;
    form: any;
}
export default (props: IProps) => {
    const { isApproved, handleApprove, submitting, selectedToken, form } =
        props;

    return (
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
                <Form form={form} name="basic" autoComplete="off">
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
                        <Select
                            className="sell-form-input"
                            placeholder="Please select sell token"
                        >
                            {SellTokenOptions.map((item) => (
                                <Option value={item.value}>{item.label}</Option>
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
                        <Input
                            className="sell-form-input"
                            placeholder="Please input min price"
                        />
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
                        <Input
                            className="sell-form-input"
                            placeholder="Please input max price "
                        />
                    </Form.Item>
                    <Form.Item
                        label="Duration blocks"
                        name="duration"
                        rules={[
                            {
                                required: true,
                                message: 'Please input blocks!',
                            },
                        ]}
                    >
                        <Input
                            className="sell-form-input"
                            placeholder="Please input blocks"
                        />
                    </Form.Item>
                    <p className="tips">
                        <InfoCircleOutlined />
                        Dutch auction, the price gradually changes from max to
                        min over duration blocks
                    </p>
                </Form>
            </div>
        </div>
    );
};
