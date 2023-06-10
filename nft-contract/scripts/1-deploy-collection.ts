import { getRandomNonce , toNano } from "locklift";

async function main() {

    const json = {
        "type": "Basic NFT",
        "name": "VenomVentures",
        "description": "Collection of the NFT Projects for VenomVentures Platform",
        "preview": {
            "source": "https://pbs.twimg.com/media/FyPDbjdXwAApicR.png",
            "mimetype": "image/png"
        },
        "external_url": "https://venomventures.vercel.app/"
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
        value: toNano(1),
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