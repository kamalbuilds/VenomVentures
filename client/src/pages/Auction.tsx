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


type Props = {
  venomConnect: VenomConnect | undefined;
};
function Auction({ venomConnect }: Props) {

  const { address , venomProvider , standaloneProvider , balance , tokenWalletAddress , updateBalance } = useVenomWallet();
  console.log(venomProvider , standaloneProvider , balance, tokenWalletAddress  ,"h")

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
