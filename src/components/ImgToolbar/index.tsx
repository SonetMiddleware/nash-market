import React, { useState, useEffect, useMemo } from 'react';
import './index.less';
import { getOwner, getMinter } from '@/services';
import {
    getTwitterBindResult,
    addToFav,
    getFavNFT,
    PLATFORM,
    IBindResultData,
} from '@/services';
import { Popover, message } from 'antd';

import { ArrowRightOutlined } from '@ant-design/icons';

import IconFav from '@/assets/images/icon-fav.png';
import IconMinterRole from '@/assets/images/icon-minter-role.png';
import IconMinter from '@/assets/images/icon-minter.png';
import IconOwnerRole from '@/assets/images/icon-owner-role.png';
import IconOwner from '@/assets/images/icon-owner.png';
import IconShare from '@/assets/images/icon-share.png';
import IconSource from '@/assets/images/icon-source.png';
import { useWeb3React } from '@web3-react/core';

const PlatwinMEME2WithoutRPC = '0x0daB724e3deC31e5EB0a000Aa8FfC42F1EC917C5';

function ImgToolbar(props: { hash: string; tokenId: number }) {
    const { account } = useWeb3React();

    const [isInFav, setIsInFav] = useState(false);
    const [owner, setOwner] = useState('');
    const [minter, setMinter] = useState('');
    const [minterPlatformAccount, setMinterPlatformAccount] = useState<
        IBindResultData[]
    >([]);
    const [ownerPlatformAccount, setOwnerPlatformAccount] = useState<
        IBindResultData[]
    >([]);
    const { hash, tokenId } = props;
    const ipfsOrigin = `https://${hash}.ipfs.dweb.link/`;

    const isBothMinterOwner = useMemo(() => {
        return owner && owner == minter;
    }, [owner, minter]);

    //TODO 根据发推人的身份来确认显示什么图标
    const fetchInfo = async () => {
        console.log('>>>>>>>>>>>>>fetchInfo: ', tokenId);
        const ownerAddress = await getOwner(tokenId);
        const minterAddress = await getMinter(tokenId);
        console.log('ownerAddress: ', ownerAddress, tokenId);
        console.log('minterAddress: ', minterAddress, tokenId);
        setOwner(ownerAddress);
        setMinter(minterAddress);
        const ownerBindResult = await getTwitterBindResult({
            addr: ownerAddress,
        });
        const bindings = ownerBindResult.filter((item) => item.content_id);
        console.log('ownerBindings: ', bindings);

        setOwnerPlatformAccount(bindings);
        const minterBindResult = await getTwitterBindResult({
            addr: minterAddress,
        });
        const minterBindings = minterBindResult.filter(
            (item) => item.content_id,
        );
        setMinterPlatformAccount(minterBindings);
        console.log('minterBindings: ', minterBindings);
    };

    useEffect(() => {
        (async () => {
            if (hash && tokenId) {
                fetchInfo();
                const favNFTs = await getFavNFT({
                    addr: account,
                    contract: PlatwinMEME2WithoutRPC,
                });
                if (favNFTs.some((item) => item.token_id === Number(tokenId))) {
                    setIsInFav(true);
                }
            }
        })();
    }, [account, hash, tokenId]);

    const getPlatformUserHomepage = (data: IBindResultData) => {
        if (data.platform === PLATFORM.Facebook) {
            const url = `https://www.facebook.com/${data.tid}`;
            return url;
        } else if (data.platform === PLATFORM.Twitter) {
            const url = `https://twitter.com/${data.tid}`;
            return url;
        }
    };

    const toMinterTwitter = (e) => {
        e.stopPropagation();
        if (minterPlatformAccount[0]) {
            const url = getPlatformUserHomepage(minterPlatformAccount[0]);
            window.open(url, '_blank');
        }
    };
    const toOwnerTwitter = (e) => {
        e.stopPropagation();
        if (ownerPlatformAccount[0]) {
            const url = getPlatformUserHomepage(ownerPlatformAccount[0]);
            window.open(url, '_blank');
        }
    };

    const handleShare = async () => {
        //TODO extension get key from localStorage
        localStorage.setItem('SHARING_NFT_META', `${hash}_${tokenId}`);
        const targetUrl = window.location.href.includes('twitter')
            ? 'https://www.facebook.com'
            : 'https://www.twitter.com';
        window.open(targetUrl, '_blank');
    };

    const shareContent = () => (
        <div className="img-mask-share">
            <ul>
                <li>
                    <a target="_blank" onClick={handleShare}>
                        Share to Twitter <ArrowRightOutlined />{' '}
                    </a>
                </li>
                <li>
                    <a target="_blank" onClick={handleShare}>
                        Share to Facebook <ArrowRightOutlined />{' '}
                    </a>
                </li>
                {/* <li>
                    <a href="" target="_blank" >Share to Instagram <ArrowRightOutlined /> </a>
                </li> */}
            </ul>
        </div>
    );
    const handleAddToFav = async (e) => {
        if (!account) {
            message.warning('Please connect wallet.');
            return;
        }
        e.stopPropagation();
        try {
            const params = {
                addr: account,
                contract: PlatwinMEME2WithoutRPC,
                token_id: tokenId,
                fav: 1,
                uri: hash,
            };
            await addToFav(params);
            setIsInFav(true);
            message.success('Add to favorite succed!');
        } catch (err) {
            console.log(err);
            message.error('Add to favorite failed.');
        }
    };

    return (
        <div className="img-mask-container">
            <div className="img-mask-icon">
                <div className="img-mask-icon-list" style={{ display: 'flex' }}>
                    <Popover content="View source">
                        <div
                            className="toolbar-icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(ipfsOrigin, '_blank');
                            }}
                        >
                            <img src={IconSource} alt="" />
                        </div>
                    </Popover>

                    {/* <Popover
                        placement="bottom"
                        title={'Share'}
                        content={shareContent}
                        trigger="hover"
                    >
                        <div className="toolbar-icon">
                            <img src={IconShare} alt="" />
                        </div>
                    </Popover> */}

                    {!isInFav && (
                        <Popover content="Add to fav">
                            <div
                                className="toolbar-icon"
                                onClick={handleAddToFav}
                            >
                                <img src={IconFav} alt="" />
                            </div>
                        </Popover>
                    )}

                    {!isBothMinterOwner && ownerPlatformAccount.length > 0 && (
                        <Popover content="View owner">
                            <div
                                className="toolbar-icon"
                                onClick={toOwnerTwitter}
                            >
                                <img src={IconOwner} alt="" />
                            </div>
                        </Popover>
                    )}
                    {!isBothMinterOwner && minterPlatformAccount.length > 0 && (
                        <Popover content="View minter">
                            <div
                                className="toolbar-icon"
                                onClick={toMinterTwitter}
                            >
                                <img src={IconMinter} alt="" />
                            </div>
                        </Popover>
                    )}
                </div>

                {/* {!isBothMinterOwner && (
                    <Popover content="View the owner">
                        <div className="toolbar-icon" onClick={toOwnerTwitter}>
                            <img src={IconOwnerRole} alt="" />
                        </div>
                    </Popover>
                )}
                {!isBothMinterOwner && (
                    <Popover content="View the minter">
                        <div className="toolbar-icon" onClick={toMinterTwitter}>
                            <img src={IconMinterRole} alt="" />
                        </div>
                    </Popover>
                )} */}
                {isBothMinterOwner && (
                    <Popover content="View the minter & owner">
                        <div className="toolbar-icon" onClick={toMinterTwitter}>
                            <svg
                                width="17"
                                height="18"
                                viewBox="0 0 17 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M7.2514 10.6147V17.1467H0C0 15.4143 0.763985 13.7529 2.12389 12.5279C3.48379 11.3029 5.32821 10.6147 7.2514 10.6147V10.6147ZM12.69 16.7385L10.026 18L10.5345 15.3284L8.3799 13.4357L11.3584 13.0454L12.69 10.6147L14.0224 13.0454L17 13.4357L14.8454 15.3284L15.353 18L12.69 16.7385ZM7.2514 9.79814C4.2466 9.79814 1.81285 7.60581 1.81285 4.89907C1.81285 2.19233 4.2466 0 7.2514 0C10.2562 0 12.69 2.19233 12.69 4.89907C12.69 7.60581 10.2562 9.79814 7.2514 9.79814Z"
                                    fill="url(#paint0_linear_64:366)"
                                />
                                <defs>
                                    <linearGradient
                                        id="paint0_linear_64:366"
                                        x1="8.5"
                                        y1="0"
                                        x2="8.5"
                                        y2="18"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stop-color="#FF9A46" />
                                        <stop
                                            offset="0.489583"
                                            stop-color="#FF67C1"
                                        />
                                        <stop
                                            offset="0.973958"
                                            stop-color="#9D5FE9"
                                        />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </Popover>
                )}
            </div>
        </div>
    );
}

export default ImgToolbar;
