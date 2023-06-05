import { AppShell, MantineProvider } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import CampaignDetails from "./pages/CampaignDetails";
import CreateCampaign from "./pages/CreateCampaign";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Connect from "./pages/Connect";
// importing the context
import { AssetPriceContext, useAssetPrice } from '../src/context/AssetPriceContext';
import { EthBalance } from '../src/pages/EthBalance';
import { useState } from "react";


const App = () => {
  const assetPrice = useAssetPrice();

  return (
    <div>
          <AssetPriceContext.Provider value={assetPrice}>
            <AppShell padding="md" navbar={<Navbar />} header={<Header />} >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create-campaign" element={<CreateCampaign />} />
                <Route path="/campaign-details/:id" element={<CampaignDetails />} />
                <Route path="/Connect" element={<Connect />} />
                <Route path="/analyse" element={<EthBalance />} />
              </Routes>
            </AppShell>.
          </AssetPriceContext.Provider>
    </div>
  );
};

export default App;
