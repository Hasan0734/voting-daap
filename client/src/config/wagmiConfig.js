import { mainnet, sepolia, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

const wagmiConfig = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [mainnet, sepolia],
    ssr: true, // If your dApp uses server side rendering (SSR)
  });


  export default wagmiConfig;