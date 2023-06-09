import React, { useEffect, useState } from 'react';
import { VenomConnect } from 'venom-connect';
import { Address, ProviderRpcClient } from 'everscale-inpage-provider';
import { formatBalance, shortAddress } from '../utils/helpers';
import { useVenomWallet } from '../hooks/useVenomWallet';
import NftAuction from '../components/NftAuction';
import '../styles/main.css';
import fonImg from '../styles/img/decor.svg';
import LogOutImg from '../styles/img/log_out.svg';

// Do not forget about ABI. We need it to call our smart contracts!
import tokenRootAbi from '../abi/TokenRoot.abi.json';
import tokenWalletAbi from '../abi/TokenWallet.abi.json';
// Store it somwhere....for example in separate files for constants
import { TOKEN_ROOT_ADDRESS } from '../utils/constants';


function Auction() {

  const { address , venomProvider , standaloneProvider  } = useVenomWallet();
  console.log(venomProvider , standaloneProvider   ,"h");

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
  console.log(tokenWalletAddress,"tokenWalletAddress");

  // two hooks to init connected user's TokenWallet address and balance.
  useEffect(() => {
    if (address && venomProvider) {
      updateTokenWalletAddress(venomProvider, address);
    }
  }, [address]);
  useEffect(() => {
    if (tokenWalletAddress) updateBalance();
  }, [tokenWalletAddress]);

  return (
    <div className="box">
      <img className="decor" alt="fon" src={fonImg} />
      <NftAuction
        address={address}
        standaloneProvider={standaloneProvider}
        balance={balance}
        venomProvider={venomProvider}
        tokenWalletAddress={tokenWalletAddress}
        checkBalance={updateBalance}
      />
    </div>
  );
}

export default Auction;
