import React, { useEffect, useState } from "react";
import { getUserFavList } from '@/services'
import { useWeb3React } from '@web3-react/core'
import { useMeme2 } from '@/hooks/useContract'
import './index.less'
export default () => {
    const { account } = useWeb3React()
    const meme2Contract = useMeme2();

    const [favList, setFavList] = useState([])

    const fetchFavList = async () => {
        const res = await getUserFavList({ addr: account })
        const resList = await Promise.all(res.map(item => meme2Contract.tokenURI(item.token_id)))
        const favList = res.map((item, index) => ({ ...item, ipfsUri: resList[index] }))
        setFavList(favList)
        console.log(favList)
    }

    useEffect(() => {
        if (account) {
            fetchFavList()
        }
    }, [account])

    return <div className="wallet-container">
        <p className="title">My Favorite:</p>
        <ul className="fav-list">
            {favList.map(item => (<li key={item.token_id}>
                <img src={item.ipfsUri} alt="" />
            </li>))}
        </ul>
    </div>
}