import { toNano, WalletTypes } from "locklift";

async function main() {

    const nftjson = {
        "type": "Basic NFT",
        "name": "VenomVentures",
        "description": "Collection of the NFT Projects for VenomVentures Platform",
        "preview": {
            "source": "https://pbs.twimg.com/media/FyPDbjdXwAApicR.png",
            "mimetype": "image/png"
        },
        "external_url": "https://venomventures.vercel.app/"
    };

    const signer = (await locklift.keystore.getSigner("0"))!;
    console.log(signer,"signer");
    const collectionArtifacts = await locklift.factory.getContractArtifacts("Collection");

    // calculation of deployed Collection contract address
    // const collectionAddress = await locklift.provider.getExpectedAddress(
    //     collectionArtifacts.abi,
    //     {
    //         tvc: collectionArtifacts.tvc,
    //         publicKey: signer.publicKey,
    //         initParams: {} // we don't have any initParams for collection
    //     }
    // );

    const collectionAddress = '0:4f852af86699f1b2b5916ad4f1f50f038c5e3cf72e91bc88db07d292719005d4';
    console.log(collectionAddress,"collec add");
    // initialize contract object by locklift
    const collectionInsance = await locklift.factory.getDeployedContract(
        "Collection",
        // @ts-ignore
        collectionAddress
    );

    // creating new account for Collection calling (or you can get already deployed by locklift.factory.accounts.addExistingAccount)
    const { account: someAccount } = await locklift.factory.accounts.addNewAccount({
        type: WalletTypes.WalletV3,
        value: toNano(0.01),
        publicKey: signer.publicKey
    });
    // call mintNft function
    // firstly get current nft id (totalSupply) for future NFT address calculating
    const {count: id} = await collectionInsance.methods.totalSupply({ answerId: 0 }).call();
    await collectionInsance.methods.mintNft({ json: JSON.stringify(nftjson) }).send({ from: someAccount.address, amount: toNano(1)});
    const {nft: nftAddress} = await collectionInsance.methods.nftAddress({ answerId: 0, id: id }).call();
  
    console.log(`NFT: ${nftAddress.toString()}`);
}
  
main()
    .then(() => process.exit(0))
    .catch(e => {
        console.log(e);
        process.exit(1);
    });
  
    // npx locklift run --network venom_devnet -s scripts/2-call-mintNft.ts