import { getRandomNonce , toNano } from "locklift";

async function main() {

    const json = {
        "type": "Basic NFT",
        "name": "Sample",
        "description": "Hello world",
        "preview": {
            "source": "https://www.forbesindia.com/media/images/2023/May/img_207611_shutterstock_2296217139_bg.jpg",
            "mimetype": "image/jpg"
        },
        "external_url": "https://www.twitter.com/0xkamal7"
    };

    console.log(JSON.stringify(json))
    const signer = (await locklift.keystore.getSigner("0"))!;
    console.log(signer.publicKey,"signer is here");
    const nftArtifacts = await locklift.factory.getContractArtifacts("Nft");
    // console.log(nftArtifacts,"nft is here");
    const indexArtifacts = await locklift.factory.getContractArtifacts("Index");
    const indexBasisArtifacts = await locklift.factory.getContractArtifacts("IndexBasis");
    // console.log(indexBasisArtifacts,"index is here");
    const { contract: sample, tx } = await locklift.factory.deployContract({
        contract: "Collection",
        publicKey: signer.publicKey,
        initParams: {
            nonce: getRandomNonce(),
            owner: `0x${signer.publicKey}`
        },
        constructorParams: {
            codeNft: nftArtifacts.code,
            json: JSON.stringify(json),
            codeIndex: indexArtifacts.code,
            codeIndexBasis: indexBasisArtifacts.code
        },
        value: toNano(5),
    });
    console.log(sample,tx,"hello");
    console.log(`Collection deployed at: ${sample.address.toString()}`);
}

main()
    .then(() => process.exit(0))
    .catch(e => {
        console.log(e);
        process.exit(1);
    });


// npx locklift run --network venom_devnet -s scripts/1-deploy-collection.ts