import { ChainContracts, MorphoMarketConfig } from './types';

export const MORPHO_MARKET: MorphoMarketConfig = {
  chainId: 1,
  marketId: '0x140fe48783fe88d2a52b31705577d917628caaf74ff79865b39d4c2aa6c2fd3c'
};

export const CHAIN_ID_TO_CONTRACTS: Record<number, ChainContracts> = {
  1: {
    morpho: {
      address: '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb',
      blockCreated: 18883124
    }
  },
  8453: {
    morpho: {
      address: '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb',
      blockCreated: 13977148
    }
  }
};
