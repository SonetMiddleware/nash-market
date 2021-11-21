import { ethers } from 'ethers';
import { simpleRpcProvider } from '@/utils/providers';
import Contracts from '@/config/constants/contracts';
import Meme2WithRPCAbi from '@/config/abi/contracts/PlatwinMEME2WithoutRPC.json';

import {
    getAddress,
    getCakeAddress,
    getMasterChefAddress,
} from './addressHelper';

import bep20Abi from '@/config/abi/erc20.json';
import cakeAbi from '@/config/abi/cake.json';

export const getContract = (
    abi: any,
    address: string,
    signer?: ethers.Signer | ethers.providers.Provider,
) => {
    const signerOrProvider = signer ?? simpleRpcProvider;
    return new ethers.Contract(address, abi, signerOrProvider);
};

export const getCakeContract = (
    signer?: ethers.Signer | ethers.providers.Provider,
) => {
    return getContract(cakeAbi, getCakeAddress(), signer);
};

export const getBep20Contract = (
    address: string,
    signer?: ethers.Signer | ethers.providers.Provider,
) => {
    return getContract(bep20Abi, address, signer);
};

export const getMeme2WithoutRPC = (
    signer?: ethers.Signer | ethers.providers.Provider,
) => {
    return getContract(
        Meme2WithRPCAbi.abi,
        Contracts.PlatwinMEME2WithoutRPC[process.env.APP_CHAIN_ID],
        signer,
    );
};
