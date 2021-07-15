import { useMemo } from 'react';
import useWeb3Provider from './useWeb3Provider';
import RpcRouterAbi from '@/config/abi/contracts/RPCRouter.json';
import ERC20Abi from '@/config/abi/erc20.json';
import Contracts from '@/config/constants/contracts';
import Meme2Abi from '@/config/abi/contracts/PlatwinMEME2.json';

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

console.log('process.env.APP_CHAIN_ID', process.env.APP_CHAIN_ID);
console.log(Contracts.RPCRouter[process.env.APP_CHAIN_ID]);
console.log(Contracts.MockRPC[process.env.APP_CHAIN_ID]);
console.log(Contracts.PlatwinMEME2[process.env.APP_CHAIN_ID]);

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
