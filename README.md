# Morpho collateral balance fetcher

## Set up

1. Install required package by:

    ```bash
    yarn install
    ```

2. Configure RPC URLs using `.env` file

    ```bash
    cp .env.example .env
    vim .env
    ```

3. Edit the configuration file (`./src/configuration.ts`) to fill in the market information.

## Usage

In `./src/main.ts`, the main function to call is `fetchUserBalanceSnapshotBatch`, where its arguments are simply a list of block number to query users' balance from. Do note that a buffer of at least 15 minutes are recommended before you can query a balance from a mined block.
