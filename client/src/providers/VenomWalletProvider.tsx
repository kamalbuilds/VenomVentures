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
        updateBalance
      }}
    >
      {children}
    </venomWalletContext.Provider>
  );
};
