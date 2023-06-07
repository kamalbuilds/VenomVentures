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

const App = () => {
  const [venomConnect, setVenomConnect] = useState<VenomConnect | undefined>();

  const init = async () => {
    const _venomConnect = await initVenomConnect();
    setVenomConnect(_venomConnect);
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <div>
            <AppShell padding="md" navbar={<Navbar />} header={<Header />} >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create-campaign" element={<CreateCampaign />} />
                <Route path="/campaign-details/:id" element={<CampaignDetails />} />
                <Route path="/auction" element={<Main venomConnect={venomConnect}/>} />
              </Routes>
            </AppShell>
    </div>
  );
};

export default App;