import { Address, ProviderRpcClient } from "everscale-inpage-provider";
import { createContext } from "react";

export interface AccountInteraction {
  address: Address;
  publicKey: string;
  contractType: string;
}

export interface VenomWalletContext {
  address?: string;
  accountInteraction?: AccountInteraction;
  venomProvider?: any;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  standaloneProvider?: ProviderRpcClient;
}

export const venomWalletContext = createContext<VenomWalletContext>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  connect: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect: async () => {},
});
