import { Address, getRandomNonce, WalletTypes } from "locklift";

// you can pass this parameter by cli or get them by some file reading for example or calculate an address with locklift.provider.getExpectedAddress()
// we just hardcode it here
// WVENOM
const TOKEN_ROOT_ADDRESS = new Address("0:6bf25d251adabf1268a8870ad1b45d46fcf782ef9f1bfa7c16032484d3e54ac7")

async function main() {
    const signer = (await locklift.keystore.getSigner("0"))!;
    // creating new account for Collection calling (or you can get already deployed by locklift.factory.accounts.addExistingAccount)
    const someAccount = await locklift.factory.accounts.addExistingAccount({
        type: WalletTypes.WalletV3,
        publicKey: signer.publicKey
    });
    const { contract: sample, tx } = await locklift.factory.deployContract({
        contract: "Auction",
        publicKey: signer.publicKey,
        initParams: {
            _owner: someAccount.address,
            _nonce: getRandomNonce()
        },
        constructorParams: {
            startTime: Math.floor(Date.now() / 1000) + 3600, // just for example. Of course you should put timestamp you want (in seconds)
            endTime: Math.floor(Date.now() / 1000) + 14400,
            tokenRoot: TOKEN_ROOT_ADDRESS,
            sendRemainingGasTo: someAccount.address
        },
        value: locklift.utils.toNano(5),
    });
  
    console.log(`Auction deployed at: ${sample.address.toString()}`);
}
  
main()
    .then(() => process.exit(0))
    .catch(e => {
        console.log(e);
        process.exit(1);
    });

    // npx locklift run --network venom_devnet --script scripts/4-send-nft-to-auction.ts
    // npx locklift run --network venom_devnet --script scripts/3-deploy-auction.ts