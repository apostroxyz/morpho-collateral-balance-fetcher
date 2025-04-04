import { Hex } from 'viem';
import { morphoAbi } from './abis/morpho';
import { MORPHO_MARKET } from './configuration';
import { loadEvents } from './loadEvents';
import { BalancesSnapshot } from './types';
import { getChainContracts, getPublicClient } from './web3';

async function fetchUserBalanceSnapshot(
  accounts: Hex[],
  blockNumber: number
): Promise<BalancesSnapshot> {
  const client = getPublicClient(MORPHO_MARKET.chainId);
  const contracts = getChainContracts(MORPHO_MARKET.chainId);

  const snapshotEntries = await Promise.all(
    accounts.map((account) =>
      client
        .readContract({
          abi: morphoAbi,
          address: contracts.morpho.address,
          functionName: 'position',
          args: [MORPHO_MARKET.marketId, account],
          blockNumber: BigInt(blockNumber)
        })
        .then(([, , collateral]) => [account, collateral] as const)
    )
  );

  return Object.fromEntries(snapshotEntries);
}

async function fetchUserBalanceSnapshotBatch(
  blockNumbers: number[]
): Promise<BalancesSnapshot[]> {
  const accounts = await fetchAllAccounts();

  return await Promise.all(
    blockNumbers.map((block) => fetchUserBalanceSnapshot(accounts, block))
  );
}

async function fetchAllAccounts(): Promise<Hex[]> {
  const client = getPublicClient(MORPHO_MARKET.chainId);
  const contracts = getChainContracts(MORPHO_MARKET.chainId);

  const latestBlock = await client.getBlockNumber();

  const supplyEvents = await loadEvents(
    BigInt(contracts.morpho.blockCreated),
    latestBlock,
    (fromBlock, toBlock) =>
      client.getContractEvents({
        abi: morphoAbi,
        address: contracts.morpho.address,
        eventName: 'SupplyCollateral',
        args: { id: MORPHO_MARKET.marketId },
        strict: true,
        fromBlock,
        toBlock
      })
  );

  return Array.from(
    new Set(supplyEvents.map(({ args }) => args.onBehalf.toLowerCase() as Hex))
  );
}

async function main() {
  const block = 22144148;
  const snapshot = (await fetchUserBalanceSnapshotBatch([block]))[0];

  console.log(`Collaterals at #${block}`);
  for (const [user, balance] of Object.entries(snapshot)) {
    if (balance === BigInt(0)) continue;
    console.log(user, balance.toString());
  }
}

main().catch(console.error);
