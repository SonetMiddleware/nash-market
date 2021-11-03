import { useMemo } from 'react';
import useWeb3Provider from './useWeb3Provider';
import RpcRouterAbi from '@/config/abi/contracts/RPCRouter.json';
import ERC20Abi from '@/config/abi/erc20.json';
import Contracts from '@/config/constants/contracts';
import Meme2Abi from '@/config/abi/contracts/PlatwinMEME2.json';
import Meme2WithRPCAbi from '@/config/abi/contracts/PlatwinMEME2WithoutRPC.json';
import MarketAbi from '@/config/abi/contracts/Market.json';
import DealRouterAbi from '@/config/abi/contracts/DealRouter.json';
import {
    getBep20Contract,
    getCakeContract,
    getContract,
} from '@/utils/contractHelper';

export const useERC20 = (address: string) => {
    const provider = useWeb3Provider();
    return useMemo(
        () => getBep20Contract(address, provider.getSigner()),
        [address, provider],
    );
};

export const useCake = () => {
    const provider = useWeb3Provider();
    return useMemo(() => getCakeContract(provider.getSigner()), [provider]);
};

export const useRpcRouter = () => {
    const provider = useWeb3Provider();
    return useMemo(
        () =>
            getContract(
                RpcRouterAbi.abi,
                Contracts.RPCRouter[process.env.APP_CHAIN_ID],
                provider.getSigner(),
            ),
        [provider],
    );
};

export const useCash = () => {
    const provider = useWeb3Provider();
    return useMemo(
        () =>
            getContract(
                ERC20Abi,
                Contracts.MockRPC[process.env.APP_CHAIN_ID],
                provider.getSigner(),
            ),
        [provider],
    );
};

export const useMeme2 = () => {
    const provider = useWeb3Provider();
    return useMemo(
        () =>
            getContract(
                Meme2Abi.abi,
                Contracts.PlatwinMEME2[process.env.APP_CHAIN_ID],
                provider.getSigner(),
            ),
        [provider],
    );
};

export const useMeme2WithoutRPC = () => {
    const provider = useWeb3Provider();
    return useMemo(
        () =>
            getContract(
                Meme2WithRPCAbi.abi,
                Contracts.PlatwinMEME2WithoutRPC[process.env.APP_CHAIN_ID],
                provider.getSigner(),
            ),
        [provider],
    );
};

export const useMarket = () => {
    const provider = useWeb3Provider();
    return useMemo(
        () =>
            getContract(
                MarketAbi.abi,
                Contracts.Market[process.env.APP_CHAIN_ID],
                provider.getSigner(),
            ),
        [provider],
    );
};

export const useMarketProxyWithoutRPC = () => {
    const provider = useWeb3Provider();
    return useMemo(
        () =>
            getContract(
                MarketAbi.abi,
                Contracts.MarketProxyWithoutRPC[process.env.APP_CHAIN_ID],
                provider.getSigner(),
            ),
        [provider],
    );
};

export const useDealRouter = () => {
    const provider = useWeb3Provider();
    return useMemo(
        () =>
            getContract(
                DealRouterAbi.abi,
                Contracts.DealRouter[process.env.APP_CHAIN_ID],
                provider.getSigner(),
            ),
        [provider],
    );
};
