import { ChainContract, Hex } from 'viem';

export interface MorphoMarketConfig {
  chainId: number;
  marketId: Hex;
}

export type BalancesSnapshot = Record<Hex, bigint>;

export type ChainContracts = {
  morpho: Required<ChainContract>;
};
