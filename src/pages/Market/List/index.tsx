import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { List, message, Avatar, Spin, Button } from 'antd';
import { useHistory } from 'umi';
import './index.less';
import { IGetOrderListParams, IOrderListItem, getOrderList } from '@/services';
import IconHeart from '@/assets/images/icon-heart.png';
import { ethers } from 'ethers';
import { SellTokenOptions } from '@/config';
const formatEther = ethers.utils.formatEther;
export default () => {
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [data, setData] = useState<IOrderListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [pageNo, setPageNo] = useState(1);

    const history = useHistory();

    const fetchData = async () => {
        setLoading(true);
        const params = {
            status: 0, // 刚创建
        } as IGetOrderListParams;
        getOrderList(params).then((res) => {
            console.log(res);
            // setTotal(dataCount);
            setData(res);
            // setPageNo(pageNo + 1);
            setLoading(false);
        });
    };

    const handleInfiniteOnLoad = () => {
        setLoading(true);
        if (data.length > total) {
            message.warning('Infinite List loaded all');
            setLoading(false);
            setHasMore(false);
            return;
        }
        fetchData();
    };

    const toDetail = (item) => {
        history.push('/detail/' + item.order_id);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="market-container ">
            {/* <InfiniteScroll
                className="market-container"
                initialLoad={false}
                pageStart={0}
                loadMore={handleInfiniteOnLoad}
                hasMore={loading && hasMore}
                useWindow={false}
            > */}
            <List
                className="img-list"
                dataSource={data}
                renderItem={(item, index) => (
                    <List.Item key={index}>
                        <div
                            className="img-item"
                            onClick={() => toDetail(item)}
                        >
                            <div
                                className="img-container"
                                style={{
                                    backgroundImage: `url(https://${item.uri}.ipfs.dweb.link/)`,
                                }}
                            >
                                {/* <img
                                    src={`https://${item.uri}.ipfs.dweb.link/`}
                                    alt=""
                                /> */}
                            </div>

                            <div className="item-info">
                                <div className="prices">
                                    <p className="label"> Price: </p>
                                    <p className="price-amount">
                                        <span>
                                            {formatEther(item.min_price)} ~{' '}
                                            {formatEther(item.max_price)}
                                        </span>
                                        <span>
                                            {' '}
                                            {
                                                SellTokenOptions.find(
                                                    (token) =>
                                                        token.value ===
                                                        item.sell_token,
                                                )?.label
                                            }
                                        </span>
                                    </p>
                                </div>
                                <div className="options">
                                    <p className="fav-num">
                                        <img src={IconHeart} alt="" />
                                        <span>10</span>
                                    </p>
                                    <p>
                                        <button
                                            className="common-btn-primary"
                                            onClick={() => toDetail(item)}
                                        >
                                            Buy now
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </List.Item>
                )}
            >
                {loading && hasMore && (
                    <div className="demo-loading-container">
                        <Spin />
                    </div>
                )}
            </List>
            {/* </InfiniteScroll> */}
        </div>
    );
};
