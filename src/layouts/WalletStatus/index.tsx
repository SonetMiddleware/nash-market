import React, { useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import useAuth from '@/hooks/useAuth';
import { ConnectorNames } from '@/utils/web3';
import { Dropdown, Menu } from 'antd';
import './index.less';

export default () => {
    const { account } = useWeb3React();
    const { login, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleConnect = () => {
        const connectorId = ConnectorNames.Injected;
        login(connectorId);
    };

    const handleLogout = () => {
        logout();
    };


    const addressDisplay = useMemo(() => {
        if (account) {
            return account.substr(0, 5) + '...' + account.substr(-5);
        }
    }, [account]);


    return (
        <div className="wallet-status-container">
            {!account && (
                <button onClick={handleConnect} className="btn-common btn-connect">
                    Connect Wallet
                </button>
            )}
            {account && (

                <div className="wallet-connected">
                    <span> {addressDisplay}</span>
                </div>
            )}
        </div>
    );
};
