## VenomVentures

<p align="center">
  <img src="https://github.com/legendarykamal/VenomVentures/assets/95926324/88e86cb7-0d44-4f4d-a65b-64ab5bf1bd00" alt="logo" />
</p>

VenomVentures is an innovative platform built on the Venom blockchain that aims to connect startups and venture capitalists, providing them with a secure and efficient environment to facilitate funding opportunities. By leveraging the power of blockchain technology and utilizing NFT auctions, VenomVentures revolutionizes the fundraising process and enhances transparency, trust, and liquidity for all participants.

VenomVentures NFT Collection - https://devnet.venomscan.com/accounts/0:4f852af86699f1b2b5916ad4f1f50f038c5e3cf72e91bc88db07d292719005d4

### Features

Here's how VenomVentures works and the benefits it brings to both startups and venture capitalists: 

1. 🚀 **Tokenizing Projects**: Startups can tokenize their projects as NFTs, representing ownership or investment opportunities. By tokenizing their projects, startups can provide a clear and transparent representation of their business and the potential value it offers to investors.

2. 🎯 **Project Auctions**: The app enables startups to conduct NFT auctions, where they can showcase their projects and attract potential investors. Through the auction mechanism, startups can generate interest and competition among venture capitalists, leading to potentially higher funding amounts.

3. 💼 **Investor Participation**: Venture capitalists can participate in the funding process by placing bids on project NFTs they find promising. This allows them to express their interest and commitment to invest in specific projects. The bidding process introduces a fair and transparent way for venture capitalists to compete for investment opportunities.

4. 💰 **Enhanced Liquidity**: The app facilitates liquidity in the startup ecosystem by allowing investors to sell or trade project NFTs on secondary markets. This provides an avenue for early investors to exit their positions and for new investors to enter, creating a dynamic and liquid marketplace for startup investments.

5. 🔍 **Transparency and Trust**: VenomVentures leverages the power of blockchain technology, specifically the Venom blockchain, to provide transparent and immutable transaction records. All transactions, bids, and ownership transfers are recorded on the blockchain, ensuring that the entire funding process is transparent and can be audited by participants. This transparency builds trust among startups and venture capitalists, as they can verify the authenticity and integrity of the funding process.

6. ⚡️ **Smart Contract Integration**: The app utilizes smart contracts to automate the auction process. Smart contracts are self-executing contracts with predefined rules and conditions. They ensure that the auction process is secure and resistant to fraud. Smart contracts facilitate the automatic transfer of ownership and funds based on predefined conditions, eliminating the need for intermediaries and reducing the risk of manipulation.

By combining these features, the VenomVentures app creates a secure and efficient environment for startups and venture capitalists to connect and facilitate funding opportunities. It revolutionizes the traditional fundraising process by introducing blockchain technology and NFT auctions, which enhance transparency, trust, and liquidity for all participants. Startups can tokenize their projects, attract investors through auctions, and gain access to liquidity. Venture capitalists can discover promising projects, participate in auctions, and trade project NFTs. Overall, VenomVentures brings transparency, efficiency, and equal opportunities to the startup funding landscape. 🌟

### Flow Diagram

![image](https://github.com/legendarykamal/VenomVentures/assets/95926324/c05eac9e-d3ca-4527-9132-df0abfa4761d)

1. Startups tokenize their projects as NFTs on the Venom blockchain, representing ownership or investment opportunities.

2. These project NFTs are listed on the VenomVentures platform for auction.

3. Venture capitalists browse the available project NFTs and place bids on the ones they find promising.

4. The auction mechanism allows for competitive bidding, driving up the funding amounts and generating interest among venture capitalists.

5. Once the auction period ends, the highest bidder wins the project NFT and becomes the new owner or investor of the startup project.

6. Throughout the entire process, all transactions, bids, and ownership transfers are recorded on the Venom blockchain, ensuring transparency and trust for all participants.

7. The VenomVentures DApp integrates smart contracts, which automate the auction process. These smart contracts enforce the predefined rules and conditions of the auction, ensuring secure and fraud-resistant transactions.

8. Additionally, the app provides enhanced liquidity by allowing investors to sell or trade project NFTs on secondary markets, providing opportunities for early investors to exit their positions and new investors to enter.

This flow creates a secure and efficient environment for startups and venture capitalists to connect, facilitating funding opportunities in a transparent and trustworthy manner. The use of blockchain technology and NFT auctions revolutionizes the fundraising process, introducing liquidity and equal opportunities for all participants in the startup ecosystem.
### Getting Started

To get started with VenomVentures, follow these steps:

1. Install the required dependencies by running `npm install`.
2. Set up the Venom blockchain network and deploy the VenomVentures smart contracts.
3. Configure the project settings, including the Venom network endpoint and contract addresses.
4. Build and deploy the frontend application.
5. Start the application by running `npm start`.
6. Access VenomVentures platform through the provided URL.

### All Test Cases Pass

docker run -d --name local-node -e USER_AGREEMENT=yes -p80:80 tonlabs/local-node

npm run test -- nft-contract/test/auction-test.ts
![image](https://github.com/legendarykamal/VenomVentures/assets/95926324/fa492793-bf22-4df3-ac83-5e3067be86b6)

### For Running the scripts 

npx locklift run --network test --script scripts/1-deploy-collection.ts
npx locklift run --network local --script scripts/3-deploy-auction.ts
### Contribution Guidelines

VenomVentures welcomes contributions from the community. To contribute, please follow these guidelines:

1. Fork the repository and clone it to your local machine.
2. Create a new branch for your feature or bug fix.
3. Make your changes and ensure they are properly tested.
4. Commit your changes with clear and descriptive messages.
5. Push your branch to your forked repository.
6. Submit a pull request detailing the changes you've made.

### License

VenomVentures is released under the [MIT License](LICENSE).

### Acknowledgments

We would like to express our gratitude to the Venom open-source community for their invaluable contributions and the Venom blockchain developers for their support and guidance.

### Resources

- Venom Blockchain: [venom.network](https://venom.network)
- Smart Contracts: [VenomVentures Contracts](https://github.com/venomventures/nft-contract)
- Documentation: [VenomVentures Docs](https://venomventures-docs.com)

Join VenomVentures today and revolutionize the way startups and venture capitalists connect and collaborate for successful funding opportunities.
