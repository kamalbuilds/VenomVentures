// @ts-nocheck
import {
  Card,
  Container,
  Flex,
  Loader,
  LoadingOverlay,
  Progress,
  Text,
  Title,
} from "@mantine/core";
import { Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { z } from "zod";
import { DisplayCampaignsCardProps } from "../components/DisplayCampaigns";
import { FORM_ERROR } from "../components/Form";
import { FundForm } from "../components/FundForm";
import { calculateBarPercentage, daysLeft } from "../utils";
import {Demonstration} from "../components/demonstration/Demonstration";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { Address, ProviderRpcClient } from 'everscale-inpage-provider';
import Gallery from '../components/Gallery';
// Store it somewhere....for example in separate files for constants
import { COLLECTION_ADDRESS } from '../utils/constants';
// Our implemented util
import { getNftsByIndexes } from '../utils/nft';
import { getNftsDetailsByIndexes } from '../utils/nft';
import { useVenomWallet } from '../hooks/useVenomWallet';

type Props = {
address?: string;
myCollectionItems: string[] | undefined;
setMyCollectionItems: (value: string[] | undefined) => void;
};

export const CreateFundValidation = z.object({
  amount: z.number().min(0.0000001),
});

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

function Test() {
const { address, venomProvider , listIsEmpty } = useVenomWallet();
// console.log(details, listIsEmpty,"details from context");
// const [listIsEmpty, setListIsEmpty] = useState(false);
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
  // setListIsEmpty(false);
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
      // if (indexesAddresses && !indexesAddresses.length) setListIsEmpty(true);
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
  // if (!address) setListIsEmpty(false);
}, [address]);

console.log(address,venomProvider,"hyhjere");
const { id } = useParams();
//   const data = details?.[id];
console.log({ id });
const data = details?.[id];
console.log(data,"jai bajarangbali");

// get campaign by id

const donateCampaign  =  "";

console.log( data );

const typedState = {
  ...data,
  target: "5",
  amountCollected: "2",
  deadline: new Date(data?.deadline),
} as DisplayCampaignsCardProps;

console.log({ typedState });
const percent = calculateBarPercentage(
  parseFloat(typedState.target),
  parseFloat(typedState.amountCollected)
);

return (
  <Container>
  <Flex gap={5} justify="space-between">
    <div>
      <div>
        <img
          className="rounded-3xl  h-124 w-124  aspect-video"
          src={typedState.nft_image}
          alt="Campaign"
        />

        <Demonstration />
        <div className="flex space-x-5 items-center my-5">
          <Progress value={percent} className="w-full" />

          <Text className="whitespace-nowrap">{percent} %</Text>
        </div>
      </div>

      <Title order={1}>{typedState.title}</Title>
    </div>

    <div className="flex flex-col text-center space-y-5">
      <Card radius="xl" p={0}>
        <Title p={15} order={2}>
          {typedState.amountCollected}
        </Title>
        <Text bg="gray" p={15} className="rounded-lg mt-1 w-full">
          Raised of {typedState.target}{" "}
        </Text>
      </Card>

      <Card radius="xl" p={0}>
        <Title p={15} order={2}>
          {daysLeft(typedState.deadline)}
        </Title>
        <Text bg="gray" p={15} className="rounded-lg mt-1 w-full">
          Day left
        </Text>
      </Card>

      <Card radius="xl" p={0}>
        <Title p={15} order={2}>
          {typedState.donators?.length}
        </Title>
        <Text bg="gray" p={15} className="rounded-lg mt-1 w-full">
          Total Backers
        </Text>
      </Card>
    </div>
  </Flex>

  <div className="grid md:grid-cols-2 gap-5 ">
    <div>
      <div>
        <Title order={3} mt={15}>
          Creator{" "}
        </Title>
        <Text>{typedState.owner}</Text>
      </div>
      <div>
        <Title order={3} mt={15}>
          Story{" "}
        </Title>
        <Text>{typedState.description}</Text>
      </div>

      <div>
        <Title order={3} mt={15}>
          Donators{" "}
        </Title>
        {typedState.donators && typedState.donators.length > 0 ? (
          typedState.donators.map((donator: any) => <Text>{donator}</Text>)
        ) : (
          <Text>No donators yet. Be the first one! </Text>
        )}
      </div>
    </div>

    <div>
      <div className="my-6">
        {!address ? (
          <Text>You need to connect your wallet to fund this campaign</Text>
        ) : (
          <>
          <FundForm
            submitText="Fund Campaign"
            schema={CreateFundValidation}
            initialValues={{}}
            onSubmit={async (values) => {
              try {
                
                // fund campaign

                showNotification({
                  title: "Successfully funded",
                  message: "Thank you for funding this campaign",
                  color: "green",
                });
              } catch (error: any) {
                console.log({ error: error });
                showNotification({
                  title: "Something went wrong",
                  message: "Failed to fund",
                  color: "red",
                });
                return {
                  [FORM_ERROR]: error.reason,
                };
              }
            }}
          />
          <Button onClick={donateCampaign} className="my-6 mb-6 justify-center text-center">Put NFT to Auction</Button>
          </>
        )}
      </div>
    </div>
  </div>
</Container>
);
}

export default Test;
