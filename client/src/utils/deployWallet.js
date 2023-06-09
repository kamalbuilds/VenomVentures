import { useEffect } from 'react';
import { TonClient } from '@eversdk/core';
import everWalletABI from '../abi/everWallet.abi.json';
import everWalletCode from '../abi/Wallet.code.boc';

async function deployWallet(destnaddress, amount, comment) {
  const client = new TonClient({ network: { endpoints: "https://jrpc-devnet.venom.foundation/" } });

  console.log("client", client);
  // To run this test, you need to send at least this amount in tokens to the specified account
  const MINIMAL_BALANCE = 1;

  // Helper function for waiting
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  try {
    // Generate a key pair for the wallet to be deployed
    const keypair = await client.crypto.generate_random_sign_keys();

    // Save generated keypair!
    console.log('Generated wallet keys:', JSON.stringify(keypair));
    console.log('Do not forget to save the keys!');

    // To deploy a wallet we need its code and ABI files
    const initData = await client.abi.encode_boc({
      params: [
        { name: "publicKey", type: "uint256" },
        { name: "timestamp", type: "uint64" }
      ],
      data: {
        "publicKey": `0x` + keypair.public,
        "timestamp": 0
      }
    });

    console.log('Init data', initData);

    const stateInit = await client.boc.encode_state_init({
      code: everWalletCode,
      data: initData.boc
    });

    const everWalletAddress = `0:` + (await client.boc.get_boc_hash({ boc: stateInit.state_init })).hash;
    console.log('Address: ', everWalletAddress);

    console.log(`You can topup your wallet from dashboard at https://dashboard.evercloud.dev`);
    console.log(`Please send >= ${MINIMAL_BALANCE} tokens to ${everWalletAddress}`);
    console.log(`awaiting...`);

    let balance;
    for (;;) {
      const getBalanceQuery = `
        query getBalance($address: String!) {
          blockchain {
            account(address: $address) {
              info {
                balance
              }
            }
          }
        }
      `;

      const resultOfQuery = await client.net.query({
        query: getBalanceQuery,
        variables: { address: everWalletAddress }
      });

      const nanotokens = parseInt(resultOfQuery.result.data.blockchain.account.info?.balance, 16);
      if (nanotokens >= MINIMAL_BALANCE * 1e9) {
        balance = nanotokens / 1e9;
        break;
      }

      await sleep(1000);
    }

    console.log(`Account balance is: ${balance.toString(10)} tokens`);

    console.log(`Making first transfer+deploy from ever-wallet contract to address: -1:7777777777777777777777777777777777777777777777777777777777777777 and waiting for transaction...`);

    let body = await client.abi.encode_message_body({
      address: everWalletAddress,
      abi: { type: 'Json', value: everWalletABI },
      call_set: {
        function_name: 'sendTransaction',
        input: {
          dest: '-1:7777777777777777777777777777777777777777777777777777777777777777',
          value: '1000000000', // amount in nano EVER
          bounce: false,
          flags: 3,
          payload: 'Funding for your project'
        }
      },
      is_internal: false,
      signer: { type: 'Keys', keys: keypair }
    });

    let deployAndTransferMsg = await client.boc.encode_external_in_message({
      dst: everWalletAddress,
      init: stateInit.state_init,
      body: body.body
    });

    let sendRequestResult = await client.processing.send_message({
      message: deployAndTransferMsg.message,
      send_events: false
    });

    let transaction = await client.processing.wait_for_transaction({
      abi: { type: 'Json', value: everWalletABI },
      message: deployAndTransferMsg.message,
      shard_block_id: sendRequestResult.shard_block_id,
      send_events: false
    });

    console.log('Contract deployed. Transaction hash', transaction.transaction.id);

    //
    // Make simple transfer
    //

    console.log(`Making simple transfer from ever-wallet contract to address: -1:7777777777777777777777777777777777777777777777777777777777777777 and waiting for transaction...`);

    const comment = await client.abi.encode_boc({
      params: [
        { name: "op", type: "uint32" }, // operation
        { name: "comment", type: "bytes" }
      ],
      data: {
        "op": 0, // operation = 0 means comment
        "comment": Buffer.from("My comment").toString("hex"),
      }
    });

    body = await client.abi.encode_message_body({
      address: everWalletAddress,
      abi: { type: 'Json', value: everWalletABI },
      call_set: {
        function_name: 'sendTransaction',
        input: {
          dest: '-1:7777777777777777777777777777777777777777777777777777777777777777',
          value: '500000000', // amount in units (nano)
          bounce: false,
          flags: 3,
          payload: comment.boc // specify "" if no payload is provided
        }
      },
      is_internal: false,
      signer: { type: 'Keys', keys: keypair }
    });

    let transferMsg = await client.boc.encode_external_in_message({
      dst: everWalletAddress,
      body: body.body
    });

    sendRequestResult = await client.processing.send_message({
      message: transferMsg.message,
      send_events: false
    });

    transaction = await client.processing.wait_for_transaction({
      abi: { type: 'Json', value: everWalletABI },
      message: transferMsg.message,
      shard_block_id: sendRequestResult.shard_block_id,
      send_events: false
    });

    console.log('Contract deployed. Transaction hash', transaction.transaction.id);

    //
    // Read all wallet transactions
    //

    const accountQuery = `
      query getTransactions($address: String!, $cursor: String, $count: Int) {
        blockchain {
          account(address: $address) {
            transactions(
              first: $count, 
              after: $cursor,
              allow_latest_inconsistent_data: true
            ) {
              edges {
                node { hash }
              }
              pageInfo { 
                endCursor
                hasNextPage
              }
            }
          }
        }
      }
    `;

    let cursor = undefined;
    const itemsPerPage = 2;

    for (;;) {
      const queryResult = await client.net.query({
        query: accountQuery,
        variables: {
          address: everWalletAddress,
          count: itemsPerPage,
          cursor
        }
      });

      const transactions = queryResult.result.data.blockchain.account.transactions.edges;
      const pageInfo = queryResult.result.data.blockchain.account.transactions.pageInfo;

      for (const transaction of transactions) {
        console.log('Transaction hash:', transaction.node.hash);
      }

      if (pageInfo.hasNextPage) {
        cursor = pageInfo.endCursor;
      } else {
        break;
      }
    }

  } catch (error) {
    console.error('Error occurred:', error);
  }
}

export default deployWallet;