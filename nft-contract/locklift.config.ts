import { LockliftConfig } from "locklift";
import { FactorySource } from "./build/factorySource";
import { GiverWallet, SimpleGiver } from "./giverSettings";
declare global {
  const locklift: import("locklift").Locklift<FactorySource>;
}

 // Devnet
const DEV_NET_NETWORK_ENDPOINT = process.env.DEV_NET_NETWORK_ENDPOINT || "https://devnet-sandbox.evercloud.dev/graphql";

const VENOM_DEVNET_ENDPOINT = process.env.VENOM_DEVNET_ENDPOINT || "https://jrpc-devnet.venom.foundation/";

const VENOM_DEVNET_TRACE_ENDPOINT =
  process.env.VENOM_DEVNET_TRACE_ENDPOINT || "https://gql-devnet.venom.network/graphql";



const config: LockliftConfig = {
  compiler: 
  
  { 
    version: "0.61.2",

    externalContracts: {
      "./precompiled": ['Index', 'IndexBasis']
    }

  },
  linker: {
    version: "0.15.48",
  },
  networks: {
       test: {
      connection: {
        id: 1,
        type: "graphql",
        group: "dev",
        data: {
          endpoints: [DEV_NET_NETWORK_ENDPOINT],
          latencyDetectionInterval: 1000,
          local: false,
        },
      },
      giver: {
        giverFactory: (ever, keyPair, address) => new SimpleGiver(ever, keyPair, address),
        address: "0:0000000000000000000000000000000000000000000000000000000000000000",
        key: "secret key",
        // phrase: "",
      },
      tracing: {
        endpoint: DEV_NET_NETWORK_ENDPOINT,
      },
      keys: {
        // Use everdev to generate your phrase
        // !!! Never commit it in your repos !!!
        // phrase: "action inject penalty envelope rabbit element slim tornado dinner pizza off blood",
        amount: 20,
      },
    },
    venom_devnet: {
      connection: {
        id: 1002,
        type: "jrpc",
        group: "dev",
        data: {
          endpoint: VENOM_DEVNET_ENDPOINT,
        },
      },
      giver: {
        address: "0:9fa98bf9e91cb0ad1160fb2f20327e7bb9317e48f7d153898d75ccb9940abce4",
        phrase: "virtual bone upon seek useful obey motor dragon achieve mixture ribbon example",
        accountId: 0,
      },
      tracing: {
        endpoint: VENOM_DEVNET_TRACE_ENDPOINT,
      },
      keys: {
        // Use everdev to generate your phrase
        // !!! Never commit it in your repos !!!
        phrase: "virtual bone upon seek useful obey motor dragon achieve mixture ribbon example",
        amount: 20,
      },
    },
    
  },
  mocha: {
    timeout: 2000000,
  },
};

export default config;