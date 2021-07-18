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
