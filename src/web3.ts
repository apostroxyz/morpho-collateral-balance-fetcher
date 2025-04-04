import { createPublicClient, PublicClient, http, Chain } from 'viem';
import * as chains from 'viem/chains';

import { CHAIN_ID_TO_CONTRACTS } from './configuration';
import { ChainContracts } from './types';

import dotenv from 'dotenv';
dotenv.config();

export function getPublicClient(chainId: number): PublicClient {
  const chain = Object.values(chains as Record<string, Chain>).find(
    (c) => c.id === chainId
  );

  if (!chain) {
    throw new Error(`Chain with id ${chainId} not found`);
  }

  const customRpcUrl = process.env[`RPC_URL_${chainId}`];

  const publicClient = createPublicClient({
    transport: http(),
    chain: {
      ...chain,
      rpcUrls: customRpcUrl
        ? {
            default: {
              http: [customRpcUrl]
            }
          }
        : chain.rpcUrls
    },
    batch: {
      multicall: 'multicall3' in (chain.contracts || {})
    }
  });

  return publicClient;
}

export function getChainContracts(chainId: number): ChainContracts {
  const contracts = CHAIN_ID_TO_CONTRACTS[chainId];
  if (!contracts) {
    throw new Error(`Chain contracts for chainId ${chainId} not found`);
  }
  return contracts;
}
