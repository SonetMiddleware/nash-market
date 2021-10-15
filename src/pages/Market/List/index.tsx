import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { List, message, Avatar, Spin } from 'antd';
import { useHistory } from 'umi';
import { IGetOrderListParams, IOrderListItem, getOrderList } from '@/services';
export default () => {
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [data, setData] = useState<IOrderListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [pageNo, setPageNo] = useState(1);

    const history = useHistory();

    const fetchData = async () => {
        setLoading(true);
        const params = {} as IGetOrderListParams;
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
        history.push('/detail/' + item.id);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <p>Market: </p>
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
                        <div className="img-item">
                            <img
                                onClick={() => toDetail(item)}
                                src={`${imgOrigin}?uri=${item.resource}&size=500x0`}
                                alt=""
                            />
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
