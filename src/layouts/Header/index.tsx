import React from 'react';
import { NavLink } from 'umi';
import './index.less';
import WalletStatus from '../WalletStatus';
import useEagerConnect from '@/hooks/useEagerConnect';
import Logo from '@/assets/images/soda-logo.png';

export default () => {
    useEagerConnect();

    return (
        <div className="header-nav">
            <img className="logo" src={Logo} alt="" />
            <ul>
                <li>
                    <NavLink
                        exact
                        to="/"
                        isActive={(match, location) => {
                            if (!match) {
                                return false;
                            }
                            const pathname = location.pathname;
                            console.log('pathname:', pathname);
                            return (
                                pathname === '/' ||
                                pathname.startsWith('/detail')
                            );
                        }}
                    >
                        Market
                    </NavLink>
                </li>
                {/* <li>
                    <NavLink to="/mint">
                        Mint
                    </NavLink>
                </li> */}
                <li>
                    <NavLink to="/wallet">My Wallet</NavLink>
                </li>
            </ul>
            <div className="wallet-status">
                <WalletStatus />
            </div>
        </div>
    );
};
