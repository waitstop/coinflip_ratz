import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";

export const BD_URI = process.env.NODE_ENV !== 'production' ? "http://localhost:5000/graphql":"https://37.140.192.155:5000/graphql"
export const PUBLIC_ADDRESS_OWNER = "AHyZ8fr4JgXcqnCBHQAkHtiABq4EQkmm7ZPcnr7rekgX"
export const network = process.env.NODE_ENV !== 'production' ? WalletAdapterNetwork.Devnet: WalletAdapterNetwork.Devnet; //CHANGE IF PROD