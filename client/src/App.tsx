import { AppShell, MantineProvider } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import CampaignDetails from "./pages/CampaignDetails";
import CreateCampaign from "./pages/CreateCampaign";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Main from './pages/Main';
import { useEffect , useState } from "react";
import { VenomConnect } from "venom-connect";
import { initVenomConnect } from "./venom-connect/configure";
import { Address, ProviderRpcClient } from 'everscale-inpage-provider';
import { VenomWalletProvider } from "./providers/VenomWalletProvider";
import LandingPage from "./pages/LandingPage";

const App = () => {
  const [venomConnect, setVenomConnect] = useState<VenomConnect | undefined>();
  const [standaloneProvider, setStandAloneProvider] = useState<ProviderRpcClient | undefined>();
  const init = async () => {
    const _venomConnect = await initVenomConnect();
    setVenomConnect(_venomConnect);
  };
  const [myCollectionItems, setMyCollectionItems] = useState<string[] | undefined>();

  const [venomProvider, setVenomProvider] = useState<any>();
  const [address, setAddress] = useState();
  // This method allows us to gen a wallet address from inpage provider
  const getAddress = async (provider: any) => {
    const providerState = await provider?.getProviderState?.();
    return providerState?.permissions.accountInteraction?.address.toString();
  };
  // Any interaction with venom-wallet (address fetching is included) needs to be authentificated
  const checkAuth = async (_venomConnect: any) => {
    const auth = await _venomConnect?.checkAuth();
    if (auth) await getAddress(_venomConnect);
  };
  // Method for getting a standalone provider from venomConnect instance
  const initStandalone = async () => {
    const standalone = await venomConnect?.getStandalone();
    setStandAloneProvider(standalone);
  };
  // Handling click of login button. We need to call connect method of out VenomConnect instance, this action will call other connect handlers
  const onLogin = async () => {
    if (!venomConnect) return;
    await venomConnect.connect();
  };
  // This handler will be called after venomConnect.login() action
  // connect method returns provider to interact with wallet, so we just store it in state
  const onConnect = async (provider: any) => {
    setVenomProvider(provider);
    await onProviderReady(provider);
  };
  // This handler will be called after venomConnect.disconnect() action
  // By click logout. We need to reset address and balance.
  const onDisconnect = async () => {
    venomProvider?.disconnect();
    setAddress(undefined);
  };
  // When our provider is ready, we need to get address and balance from.
  const onProviderReady = async (provider: any) => {
    const venomWalletAddress = provider ? await getAddress(provider) : undefined;
    setAddress(venomWalletAddress);
  };
  useEffect(() => {
    // connect event handler
    const off = venomConnect?.on('connect', onConnect);
    if (venomConnect) {
      initStandalone();
      checkAuth(venomConnect);
    }
    // just an empty callback, cuz we don't need it
    return () => {
      off?.();
    };
  }, [venomConnect]);

  return (
    <div>
            <VenomWalletProvider>
              <AppShell padding="md" navbar={<Navbar />} header={<Header />} >
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Home standaloneProvider= {standaloneProvider}/>} />
                  <Route path="/profile" element={
                  <Profile 
                    myCollectionItems={myCollectionItems}
                    setMyCollectionItems={setMyCollectionItems}  
                  />} />
                  <Route path="/create-campaign" element={<CreateCampaign  />} />
                  <Route path="/campaign-details/:id" element={<CampaignDetails />} />
                  <Route path="/auction" element={<Main venomConnect={venomConnect}/>} />
                </Routes>
              </AppShell>
            </VenomWalletProvider>
    </div>
  );
};

export default App;