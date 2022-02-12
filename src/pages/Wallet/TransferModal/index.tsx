import React, { useState } from 'react';
import { Button, message, Modal, Select, Form, Input } from 'antd';
import './index.less';
import { IOwnedListItem } from '@/services';
import { ethers } from 'ethers';
interface IProps {
    visible: boolean;
    onOk: (targetAddress: string) => void;
    onCancel: () => void;
    selectedToken: IOwnedListItem;
    transferring: boolean;
}
export default (props: IProps) => {
    const { visible, onOk, onCancel, selectedToken, transferring } = props;
    const [target, setTarget] = useState('');
    const handleSend = () => {
        if (!target || !ethers.utils.isAddress(target)) {
            message.warn('Please enter a valid address');
            return;
        }
        onOk(target);
    };
    return (
        <Modal
            title="Transfer NFT"
            className="sell-modal"
            visible={visible}
            onOk={handleSend}
            onCancel={onCancel}
            okButtonProps={{ loading: transferring }}
        >
            <div className="transfer-container">
                <div className="sell-img-container">
                    <img
                        src={`https://${selectedToken?.uri}.ipfs.dweb.link/`}
                        alt=""
                    />
                </div>
                <div className="transfer-form">
                    <label>Send To:</label>
                    <Input
                        value={target}
                        placeholder="Enter address"
                        onChange={(e) => setTarget(e.target.value)}
                    ></Input>
                </div>
            </div>
        </Modal>
    );
};
