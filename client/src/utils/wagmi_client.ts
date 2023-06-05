import { polygon, polygonMumbai } from "wagmi/chains";
import { configureChains, createClient, Chain } from "wagmi";
import { publicProvider } from "wagmi/providers/public";


const { chains, provider } = configureChains(
  [polygon, polygonMumbai],
  [publicProvider()]
);

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
});
