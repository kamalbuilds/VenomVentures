import { AppShell, MantineProvider } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import CampaignDetails from "./pages/CampaignDetails";
import CreateCampaign from "./pages/CreateCampaign";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Auction from './pages/Auction';
import { useEffect , useState } from "react";
import { VenomConnect } from "venom-connect";
import { initVenomConnect } from "./venom-connect/configure";
import { Address, ProviderRpcClient } from 'everscale-inpage-provider';
import { VenomWalletProvider } from "./providers/VenomWalletProvider";
import LandingPage from "./pages/LandingPage";
import Test from "./pages/Test";

const App = () => {
  return (
    <div>
            <VenomWalletProvider>
              <AppShell padding="md" navbar={<Navbar />} header={<Header />} >
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Home />} />
                  <Route path="/t" element={<Test />} />
                  <Route path="/profile" element={ <Profile />} />
                  <Route path="/create-campaign" element={<CreateCampaign  />} />
                  <Route path="/campaign-details/:id" element={<Test />} />
                  <Route path="/auction" element={<Auction />} />
                </Routes>
              </AppShell>
            </VenomWalletProvider>
    </div>
  );
};

export default App;