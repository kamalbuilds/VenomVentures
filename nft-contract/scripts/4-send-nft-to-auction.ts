import { Address, toNano, WalletTypes } from "locklift";

// you can pass this parameters by cli or get them by some file reading for example or calculate an address with locklift.provider.getExpectedAddress()
// we just hardcode it here
const NFT_ADDRESS = new Address("0:b674db9f8b326947259bff2a3867b34b4bfc10d70ae3f218b8809d45f640bc70")
const AUCTION_ADDRESS = new Address("0:ca1e36e0c196babe1f7395c5c5b1c9a6c7ec07d84035af792e7542330770d3a9")

async function main() {
    const signer = (await locklift.keystore.getSigner("0"))!;
    // creating new account for Collection calling (or you can get already deployed by locklift.factory.accounts.addExistingAccount)
    const someAccount = await locklift.factory.accounts.addExistingAccount({
        type: WalletTypes.WalletV3,
        publicKey: signer.publicKey
    });
    // instantiate NFT contract
    const nftInstance = await locklift.factory.getDeployedContract(
        "Nft",
        NFT_ADDRESS
    )
    // and call a transfer method to auction from owner
    await nftInstance.methods.transfer({
        to: AUCTION_ADDRESS,
        sendGasTo: someAccount.address,
        // take attention! Next field is important for calling our onNftTransfer callback!
        // you may lose your NFT if you don't set up callback for auction here!
        callbacks: [[AUCTION_ADDRESS, {value: toNano(0.1), payload: ""}]] 
    }).send({
        from: someAccount.address,
        amount: toNano(2)
    })
  
    console.log(`NFT has been sent`);
}
  
main()
    .then(() => process.exit(0))
    .catch(e => {
        console.log(e);
        process.exit(1);
    });

    // npx locklift run --network venom_devnet --script scripts/4-send-nft-to-auction.ts