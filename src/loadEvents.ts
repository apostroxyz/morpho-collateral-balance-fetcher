export async function loadEvents<T>(
  startBlock: bigint,
  endBlock: bigint,
  eventsLoader: (fromBlock: bigint, toBlock: bigint) => Promise<T[]>
): Promise<T[]> {
  try {
    return await eventsLoader(startBlock, endBlock);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorMsg = String(error?.message || error);

    if (errorMsg.includes('eth_getLogs is limited to'.toLowerCase())) {
      const halfBlock = BigInt(
        Number(startBlock) +
          Math.round((Number(endBlock) - Number(startBlock)) / 2)
      );

      const events = await Promise.all([
        loadEvents(startBlock, halfBlock, eventsLoader),
        loadEvents(halfBlock, endBlock, eventsLoader)
      ]);

      return events.flat();
    }
    throw error;
  }
}
