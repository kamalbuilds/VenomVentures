import React, { FC, useEffect, useState } from "react";
import { initVenomConnect } from "../venom-connect/configure";
import VenomConnect from "venom-connect";
import {
  AccountInteraction,
  venomWalletContext,
} from "../contexts/venomWallet";
import { Address, ProviderRpcClient } from 'everscale-inpage-provider';
// tip3 imports
import { TOKEN_ROOT_ADDRESS } from '../utils/constants';
// Do not forget about ABI. We need it to call our smart contracts!
import tokenRootAbi from '../abi/TokenRoot.abi.json';
import tokenWalletAbi from '../abi/TokenWallet.abi.json';
import { formatBalance } from "../utils/helpers";
// Store it somewhere....for example in separate files for constants
import { COLLECTION_ADDRESS } from '../utils/constants';
// Our implemented util
import { getNftsByIndexes } from '../utils/nft';
import { getNftsDetailsByIndexes } from '../utils/nft';

type Props = {
address?: string;
myCollectionItems: string[] | undefined;
setMyCollectionItems: (value: string[] | undefined) => void;
};



// Method to returning a salted index code (base64)
const saltCode = async (provider: ProviderRpcClient, ownerAddress: string) => {
// Index StateInit you should take from github. It ALWAYS constant!
const INDEX_BASE_64 = 'te6ccgECIAEAA4IAAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAgaK2zUfBAQkiu1TIOMDIMD/4wIgwP7jAvILHAYFHgOK7UTQ10nDAfhmifhpIds80wABn4ECANcYIPkBWPhC+RDyqN7TPwH4QyG58rQg+COBA+iogggbd0CgufK0+GPTHwHbPPI8EQ4HA3rtRNDXScMB+GYi0NMD+kAw+GmpOAD4RH9vcYIImJaAb3Jtb3Nwb3T4ZNwhxwDjAiHXDR/yvCHjAwHbPPI8GxsHAzogggujrde64wIgghAWX5bBuuMCIIIQR1ZU3LrjAhYSCARCMPhCbuMA+EbycyGT1NHQ3vpA0fhBiMjPjits1szOyds8Dh8LCQJqiCFus/LoZiBu8n/Q1PpA+kAwbBL4SfhKxwXy4GT4ACH4a/hs+kJvE9cL/5Mg+GvfMNs88gAKFwA8U2FsdCBkb2Vzbid0IGNvbnRhaW4gYW55IHZhbHVlAhjQIIs4rbNYxwWKiuIMDQEK103Q2zwNAELXTNCLL0pA1yb0BDHTCTGLL0oY1yYg10rCAZLXTZIwbeICFu1E0NdJwgGOgOMNDxoCSnDtRND0BXEhgED0Do6A34kg+Gz4a/hqgED0DvK91wv/+GJw+GMQEQECiREAQ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAD/jD4RvLgTPhCbuMA0x/4RFhvdfhk0ds8I44mJdDTAfpAMDHIz4cgznHPC2FeIMjPkll+WwbOWcjOAcjOzc3NyXCOOvhEIG8TIW8S+ElVAm8RyM+EgMoAz4RAzgH6AvQAcc8LaV4gyPhEbxXPCx/OWcjOAcjOzc3NyfhEbxTi+wAaFRMBCOMA8gAUACjtRNDT/9M/MfhDWMjL/8s/zsntVAAi+ERwb3KAQG90+GT4S/hM+EoDNjD4RvLgTPhCbuMAIZPU0dDe+kDR2zww2zzyABoYFwA6+Ez4S/hK+EP4QsjL/8s/z4POWcjOAcjOzc3J7VQBMoj4SfhKxwXy6GXIz4UIzoBvz0DJgQCg+wAZACZNZXRob2QgZm9yIE5GVCBvbmx5AELtRNDT/9M/0wAx+kDU0dD6QNTR0PpA0fhs+Gv4avhj+GIACvhG8uBMAgr0pCD0oR4dABRzb2wgMC41OC4yAAAADCD4Ye0e2Q==';
// Gettind a code from Index StateInit
const tvc = await provider.splitTvc(INDEX_BASE_64);
if (!tvc.code) throw new Error('tvc code is empty');
// Salt structure that we already know
const saltStruct = [
  { name: 'collection', type: 'address' },
  { name: 'owner', type: 'address' },
  { name: 'type', type: 'fixedbytes3' }, // according to standards, each index salted with string 'nft'
] as const;
const { code: saltedCode } = await provider.setCodeSalt({
  code: tvc.code,
  salt: {
    structure: saltStruct,
    abiVersion: '2.1',
    data: {
      collection: new Address(COLLECTION_ADDRESS),
      owner: new Address(ownerAddress),
      type: btoa('nft'),
    },
  },
});
return saltedCode;
};


export interface VenomWalletProviderProps {
  children: React.ReactNode;
}

export const VenomWalletProvider: FC<VenomWalletProviderProps> = ({
  children,
}) => {
  const [accountInteraction, setAccountInteraction] =
    useState<AccountInteraction>();
  const [venomConnect, setVenomConnect] = useState<VenomConnect | undefined>();
  const init = async () => {
    const _venomConnect = await initVenomConnect();
    setVenomConnect(_venomConnect);
  };
  useEffect(() => {
    init();
  }, []);
  const [venomProvider, setVenomProvider] = useState<any>();
  const [standaloneProvider, setStandAloneProvider] = useState<ProviderRpcClient | undefined>();
  const [address, setAddress] = useState<string>();

  // tip-3
  const [balance, setBalance] = useState<string | undefined>();
  // User's TokenWallet (TIP-3) address
  const [tokenWalletAddress, setTokenWalletAddress] = useState<string | undefined>();

  // This method calls balance function of deployed TokenWallet smart contract (can be called with standalone client as provider)
  const getTokenWalletAddress = async (
    provider: ProviderRpcClient,
    userWalletAddress: string
  ): Promise<string | undefined> => {
    const contract = new provider.Contract(tokenRootAbi, new Address(TOKEN_ROOT_ADDRESS));
    const tokenWallet = (await contract.methods
      .walletOf({
        answerId: 0,
        walletOwner: userWalletAddress,
      } as never)
      .call()) as any;
    if (!tokenWallet) return undefined;
    return tokenWallet.value0._address;
  };
  // updating of user's TIP-3 balance
  const updateBalance = async () => {
    if (!tokenWalletAddress || !standaloneProvider) return;
    try {
      const contract = new standaloneProvider.Contract(tokenWalletAbi, new Address(tokenWalletAddress));
      // We check a contract state here to acknowledge if TokenWallet already deployed
      // As you remember, wallet can be deployed with first transfer on it.
      // If our wallet isn't deployed, so it's balance is 0 :)
      const contractState = await venomProvider.rawApi.getFullContractState({ address: tokenWalletAddress });
      if (contractState.state) {
        // But if this deployed, just call a balance function
        const result = (await contract.methods.balance({ answerId: 0 } as never).call()) as any;
        const tokenBalance = result.value0;
        // formatBalance is just a beauty helper to divide our balance by 10 ** 9 (decimals...our TIP-3 decimals is 9)
        setBalance(formatBalance(tokenBalance));
      } else {
        setBalance('0');
      }
    } catch (e) {
      console.error(e);
    }
  };
  // updating of user's TokenWallet (TIP-3) address (placed in hook)
  const updateTokenWalletAddress = async (provider: ProviderRpcClient, userWalletAddress: string) => {
    if (tokenWalletAddress) return;
    const walletAddress = await getTokenWalletAddress(provider, userWalletAddress);
    setTokenWalletAddress(walletAddress);
  };

  // end of tip3 code
  // This method allows us to gen a wallet address from inpage provider
  const getAccountInteraction = async (
    provider: any
  ): Promise<AccountInteraction> => {
    const providerState = await provider?.getProviderState?.();
    return providerState?.permissions.accountInteraction;
  };
  // Any interaction with venom-wallet (address fetching is included) needs to be authentificated
  const checkAuth = async (_venomConnect: VenomConnect) => {
    const auth = await _venomConnect?.checkAuth();
    if (auth) {
      const account = await getAccountInteraction(_venomConnect);
      return account?.address?.toString();
    }
  };
  // Method for getting a standalone provider from venomConnect instance
  const initStandalone = async () => {
    const standalone = await venomConnect?.getStandalone();
    setStandAloneProvider(standalone);
  };

  // When our provider is ready, we need to get the address
  const onProviderReady = async (provider: ProviderRpcClient) => {
    if (!provider) {
      return;
    }
    const accountInteraction = await getAccountInteraction(provider);
    setAccountInteraction(accountInteraction);
    setAddress(accountInteraction?.address?.toString());
  };
  useEffect(() => {
    if (address && standaloneProvider) {
      updateTokenWalletAddress(standaloneProvider, address);
    }
  }, [address]);
  
  useEffect(() => {
    if (tokenWalletAddress) updateBalance();
  }, [tokenWalletAddress]);

  useEffect(() => {
    // connect event handler
    const off = venomConnect?.on(
      "connect",
      async (provider: ProviderRpcClient) => {
        setVenomProvider(provider);
        await onProviderReady(provider);
      }
    );
    if (venomConnect) {
      initStandalone();
      checkAuth(venomConnect);
    }
    // just an empty callback, cuz we don't need it
    return () => {
      off?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venomConnect]);

  const connect = async () => {
    if (!venomConnect) return;
    await venomConnect.connect();
  };

  const disconnect = async () => {
    standaloneProvider?.disconnect();
    setAddress(undefined);
    setBalance(undefined);
    setTokenWalletAddress(undefined);

  };
  useEffect(() => {
    if (venomConnect) {
      initStandalone();
      checkAuth(venomConnect);
    }
  }, [venomConnect]);

  const [listIsEmpty, setListIsEmpty] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [details , setDetails] = useState<any>();
// Method, that return Index'es addresses by single query with fetched code hash
const getAddressesFromIndex = async (codeHash: string): Promise<Address[] | undefined> => {
  const addresses = await venomProvider?.getAccountsByCodeHash({ codeHash });
  console.log(addresses,"addresses kamal");
  return addresses?.accounts;
};

// Main method of this component
const loadNFTs = async (provider: ProviderRpcClient, ownerAddress: string) => {
  setIsLoading(true);
  setListIsEmpty(false);
  try {
    // Take a salted code
    const saltedCode = await saltCode(provider, ownerAddress);
    // Hash it
    const codeHash = await provider.getBocHash(saltedCode);
    if (!codeHash) {
      return;
    }
    // Fetch all Indexes by hash
    const indexesAddresses = await getAddressesFromIndex(codeHash);
    if (!indexesAddresses || !indexesAddresses.length) {
      if (indexesAddresses && !indexesAddresses.length) setListIsEmpty(true);
      return;
    }
    
    console.log(indexesAddresses,"indexesAddresses")
    // Fetch all image URLs
    const nftURLs = await getNftsByIndexes(provider, indexesAddresses);
    const getNftDetails = await getNftsDetailsByIndexes(provider, indexesAddresses);
    console.log(getNftDetails,"getNftDetails");
    setDetails(getNftDetails);
  } catch (e) {
    console.error(e);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  if (address && venomProvider) loadNFTs(venomProvider, address);
  if (!address) setListIsEmpty(false);
}, [address]);


  return (
    <venomWalletContext.Provider
      value={{
        connect,
        disconnect,
        address,
        accountInteraction,
        standaloneProvider,
        venomProvider,
        balance,
        tokenWalletAddress,
        updateBalance,
        details,
        listIsEmpty
      }}
    >
      {children}
    </venomWalletContext.Provider>
  );
};
