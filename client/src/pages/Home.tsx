import React, { useEffect, useState } from 'react';
import { Title } from '@mantine/core';
import { Address, ProviderRpcClient } from 'everscale-inpage-provider';
import Gallery from '../components/Gallery';
// Store it somwhere....for example in separate files for constants
import { COLLECTION_ADDRESS } from '../utils/constants';
// Do not forget about contract ABI. You need it if you need to call any smart contract
import collectionAbi from '../abi/Collection.abi.json';
// Our implemented util
import { getCollectionItems } from '../utils/nft';
type Props = {
  standaloneProvider: ProviderRpcClient | undefined;
};

function Home({ standaloneProvider }: Props) {
  // Just a strings array. Each string is an URL of NFT image.
  const [collectionItems, setCollectionItem] = useState<string[] | []>([]);
  const [listIsEmpty, setListIsEmpty] = useState(false);
  // This method returns an NFT code hash by calling Collection contract. We need code hash for searching all NFTs
  // Returned code hash is a code hash ONLY for NFT of concrete collection
  const getNftCodeHash = async (provider: ProviderRpcClient): Promise<string> => {
    const collectionAddress = new Address(COLLECTION_ADDRESS);
    const contract = new provider.Contract(collectionAbi, collectionAddress);
    const { codeHash } = await contract.methods.nftCodeHash({ answerId: 0 } as never).call({ responsible: true });
    return BigInt(codeHash).toString(16);
  };
  // Method, that return NFT's addresses by single query with fetched code hash
  const getNftAddresses = async (codeHash: string): Promise<Address[] | undefined> => {
    const addresses = await standaloneProvider?.getAccountsByCodeHash({ codeHash });
    return addresses?.accounts;
  };
  // Main method of this component. 
  const loadNFTs = async (provider: ProviderRpcClient) => {
    setListIsEmpty(false);
    try {
      const nftCodeHash = await getNftCodeHash(provider);
      if (!nftCodeHash) {
        return;
      }
      const nftAddresses = await getNftAddresses(nftCodeHash);
      if (!nftAddresses || !nftAddresses.length) {
        if (nftAddresses && !nftAddresses.length) setListIsEmpty(true);
        return;
      }
      const nftURLs = await getCollectionItems(provider, nftAddresses);
      setCollectionItem(nftURLs);
    } catch (e) {
      console.error(e);
    }
  };
  console.log(collectionItems,"yo");
  useEffect(() => {
    if (standaloneProvider) loadNFTs(standaloneProvider);
  }, [standaloneProvider]);
  return (
    <div>
      <Title align="center" mb={20}>
        All Campaigns
      </Title>
      {collectionItems && (
        <Gallery collectionsItems={collectionItems} listIsEmpty={listIsEmpty} />
      )}
    </div>
  );
}

export default Home;
