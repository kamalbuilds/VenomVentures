import { LockliftConfig } from "locklift";
import { FactorySource } from "./build/factorySource";
import { SimpleGiver, GiverWallet } from "./giverSettings";
import dotenv from "dotenv";
dotenv.config();

declare global {
  const locklift: import("locklift").Locklift<FactorySource>;
}

const secret_key = process.env.secretkey || "";
const phrase = process.env.phrase || "";
const LOCAL_NETWORK_ENDPOINT = process.env.NETWORK_ENDPOINT || "http://localhost/graphql";
const DEV_NET_NETWORK_ENDPOINT = process.env.DEV_NET_NETWORK_ENDPOINT || "https://jrpc-devnet.venom.foundation/";
const VENOM_DEVNET_GIVER_ADDRESS = process.env.VENOM_DEVNET_GIVER_ADDRESS || '0:0000000000000000000000000000000000000000000000000000000000000000';
const VENOM_DEVNET_GIVER_PHRASE = process.env.VENOM_DEVNET_GIVER_PHRASE || '';
const VENOM_DEVNET_GIVER_KEY = process.env.VENOM_DEVNET_GIVER_KEY || '';
const VENOM_TESTNET_ENDPOINT = process.env.VENOM_TESTNET_ENDPOINT || "https://jrpc-devnet.venom.foundation/";
const VENOM_TESTNET_TRACE_ENDPOINT =
  process.env.VENOM_TESTNET_TRACE_ENDPOINT || "https://gql-devnet.venom.network/graphql";

// Create your own link on https://dashboard.evercloud.dev/
const MAIN_NET_NETWORK_ENDPOINT = process.env.MAIN_NET_NETWORK_ENDPOINT || "https://mainnet.evercloud.dev/XXX/graphql";

const config: LockliftConfig = {
  compiler: {
    // Specify path to your TON-Solidity-Compiler
    // path: "/mnt/o/projects/broxus/TON-Solidity-Compiler/build/solc/solc",

    // Or specify version of compiler
    version: "0.62.0",

    // Specify config for extarnal contracts as in exapmple
    externalContracts: {
      "node_modules/tip3/build": ['TokenRoot', 'TokenWallet'],
      "precompiled": ['Index', 'IndexBasis']
    }
  },
  linker: {
    // Specify path to your stdlib
    // lib: "/mnt/o/projects/broxus/TON-Solidity-Compiler/lib/stdlib_sol.tvm",
    // // Specify path to your Linker
    // path: "/mnt/o/projects/broxus/TVM-linker/target/release/tvm_linker",

    // Or specify version of linker
    version: "0.15.48",
  },
  networks: {
    local: {
      // Specify connection settings for https://github.com/broxus/everscale-standalone-client/
      connection: {
        id: 1,
        group: "localnet",
        type: "graphql",
        data: {
          endpoints: [LOCAL_NETWORK_ENDPOINT],
          latencyDetectionInterval: 1000,
          local: true,
        },
      },
      // This giver is default local-node giverV2
      giver: {
        // Check if you need provide custom giver
	      giverFactory: (ever, keyPair, address) => new SimpleGiver(ever, keyPair, address),
        address: "0:ece57bcc6c530283becbbd8a3b24d3c5987cdddc3c8b7b33be6e4a6312490415",
        key: "172af540e43a524763dd53b26a066d472a97c4de37d5498170564510608250c3",
      },
      tracing: {
        endpoint: LOCAL_NETWORK_ENDPOINT,
      },
      keys: {
        // Use everdev to generate your phrase
        // !!! Never commit it in your repos !!!
        // phrase: "action inject penalty envelope rabbit element slim tornado dinner pizza off blood",
        amount: 20,
      },
    },
    test: {
      connection: {
        id: 1002,
        type: "jrpc",
        group: "dev",
        data: {
          endpoint: DEV_NET_NETWORK_ENDPOINT,
        },
      },
      giver: {
        giverFactory: (ever, keyPair, address) => new SimpleGiver(ever, keyPair, address),
        address: VENOM_DEVNET_GIVER_ADDRESS,
        phrase: VENOM_DEVNET_GIVER_PHRASE,
        accountId: 0,
      },
      tracing: {
        endpoint: DEV_NET_NETWORK_ENDPOINT,
      },
      keys: {
        // Use everdev to generate your phrase
        // !!! Never commit it in your repos !!!
        phrase: VENOM_DEVNET_GIVER_PHRASE,
        amount: 20,
      },
    },
    venom_testnet: {
      connection: {
        id: 1000,
        type: "jrpc",
        group: "dev",
        data: {
          endpoint: VENOM_TESTNET_ENDPOINT,
        },
      },
      giver: {
        giverFactory: (ever, keyPair, address) => new SimpleGiver(ever, keyPair, address),
        address: "0:2f58089d5457330607efc2b966d4cc7282d0d726df18e13ae0aa5680cdf3e7bb",
        phrase: "naive talent fork license vacuum rocket slot auction ability birth police wheat",
        accountId: 0,
      },
      tracing: {
        endpoint: VENOM_TESTNET_TRACE_ENDPOINT,
      },
      keys: {
        // Use everdev to generate your phrase
        // !!! Never commit it in your repos !!!
        // phrase: "action inject penalty envelope rabbit element slim tornado dinner pizza off blood",
        amount: 20,
      },
    },
    main: {
      // Specify connection settings for https://github.com/broxus/everscale-standalone-client/
      connection: {
        id: 1,
        type: "graphql",
        group: "main",
        data: {
          endpoints: [MAIN_NET_NETWORK_ENDPOINT],
          latencyDetectionInterval: 1000,
          local: false,
        },
      },
      // This giver is default Wallet
      giver: {
	      giverFactory: (ever, keyPair, address) => new GiverWallet(ever, keyPair, address),
        address: VENOM_DEVNET_GIVER_ADDRESS,
        key: VENOM_DEVNET_GIVER_KEY,
      },
      tracing: {
        endpoint: MAIN_NET_NETWORK_ENDPOINT,
      },
      keys: {
        // Use everdev to generate your phrase
        // !!! Never commit it in your repos !!!
        phrase: "action inject penalty envelope rabbit element slim tornado dinner pizza off blood",
        amount: 20,
      },
    },
  },
  mocha: {
    timeout: 2000000,
  },
};

export default config;
