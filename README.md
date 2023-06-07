## VenomVentures

VenomVentures is an innovative platform built on the Venom blockchain that aims to connect startups and venture capitalists, providing them with a secure and efficient environment to facilitate funding opportunities. By leveraging the power of blockchain technology and utilizing NFT auctions, VenomVentures revolutionizes the fundraising process and enhances transparency, trust, and liquidity for all participants.

### Features

- **Tokenizing Projects**: Startups can tokenize their projects as NFTs, representing ownership or investment opportunities.
- **Project Auctions**: Conduct NFT auctions where startups can attract potential investors through bidding on project NFTs.
- **Investor Participation**: venture capitalists can participate by placing bids on project NFTs they find promising.
- **Enhanced Liquidity**: Investors can sell or trade project NFTs on secondary markets, introducing liquidity to the startup ecosystem.
- **Transparency and Trust**: VenomVentures leverages the Venom blockchain for transparent and immutable transaction records.
- **Smart Contract Integration**: Smart contracts automate the auction process, ensuring secure and fraud-resistant transactions.

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
