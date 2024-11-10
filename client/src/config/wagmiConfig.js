import { mainnet, sepolia, localhost } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi'
import { injected, metaMask } from 'wagmi/connectors';




const wagmiConfig = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [mainnet, sepolia, localhost],
    connectors: [
      injected()
    ],
    transports: {
      [localhost.id]: http(`http://localhost:8545`),
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
    ssr: true, // If your dApp uses server side rendering (SSR)
  });


  export default wagmiConfig;