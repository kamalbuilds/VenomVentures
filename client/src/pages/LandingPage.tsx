import React from 'react';
import { FaCheck } from 'react-icons/fa';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-#1C1C1C min-h-screen">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl text-white font-bold mb-8 text-center">Welcome to VenomVentures</h1>

        <div className="flex flex-col lg:flex-row justify-between gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl text-white font-bold mb-4">Tokenizing Projects</h2>
            <p className="text-gray-300 mb-6">
              Startups can tokenize their projects as NFTs, representing ownership or investment opportunities.
            </p>

            <h2 className="text-3xl text-white font-bold mb-4">Project Auctions</h2>
            <p className="text-gray-300 mb-6">
              Conduct NFT auctions where startups can attract potential investors through bidding on project NFTs.
            </p>
          </div>

          <div className="lg:w-1/2">
            <h2 className="text-3xl text-white font-bold mb-4">Investor Participation</h2>
            <p className="text-gray-300 mb-6">
              Venture capitalists can participate by placing bids on project NFTs they find promising.
            </p>

            <h2 className="text-3xl text-white font-bold mb-4">Enhanced Liquidity</h2>
            <p className="text-gray-300 mb-6">
              Investors can sell or trade project NFTs on secondary markets, introducing liquidity to the startup ecosystem.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          
          <p className="text-gray-400 mb-4">Powered by Venom Blockchain and Smart Contracts</p>
          <FaCheck className="text-green-500 inline-block" />
          <span className="text-gray-400 ml-2">Transparency and Trust</span>
          <FaCheck className="text-green-500 inline-block ml-4" />
          <span className="text-gray-400">Secure and Fraud-Resistant Transactions</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
