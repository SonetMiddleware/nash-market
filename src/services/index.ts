import { request } from 'umi';

export interface IAddUserFavParams {
    addr: string;
    contract: string;
    token_id: string | number;
    fav: number; // 0表示取消收藏，等于1表示收藏
}
export const addUserFav = async (params: IAddUserFavParams) => {
    const url = '/api/v1/favorite-nft';
    try {
        const res = await request(url, {
            method: 'POST',
            data: params,
        });
        console.log(res);
        return res;
    } catch (err) {
        console.log(err);
    }
};

//url: api/v1/favorite?addr=xxx&contract=xxx
export interface IGetUserFavListParams {
    addr: string;
    contract?: string;
}
export const getUserFavList = async (params: IGetUserFavListParams) => {
    const url = '/api/v1/favorite';
    const res = await request(url, {
        method: 'GET',
        params,
    });
    console.log(res);
    return res.data;
};

export interface IGetOrderListParams {
    order_id?: string;
    status?: number;
    contract?: string;
    seller?: string;
    buyer?: string;
}

export interface IOrderListItem {
    order_id: string; // 订单id
    status: string; // 订单状态
    contract: string; // NFT合约地址
    erc: string; // 721或者1155
    token_id: string; //
    uri: string;
    seller: string; // 挂单用户地址
    sell_token: string; // 挂单用户出售NFT想获得的ERC20代币地址，如果是0，则表示ETH
    init_amount: string; // 初始出售数量
    min_price: string; // 最低出售价格
    max_price: string; // 最高出售价格
    start_block: string; // 订单价格开始下降的区块
    duration: string; // 订单价格下降的持续时长
    amount: string; // 剩余未售出的NFT数量
    final_price: string; // 订单全部成交时，最后一笔成交时的价格，没有完全成交的话则为0
    buyers: string; // 所有购买人
    update_block: string; // 订单状态更新的区块号
}
export const getOrderList = async (params: IGetOrderListParams) => {
    const url = '/api/v1/orders';
    const res = await request(url, {
        method: 'GET',
        params,
    });
    console.log(res);
    return res.data;
};
