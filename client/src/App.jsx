import { ConnectButton } from "@rainbow-me/rainbowkit";
import VoteCard from "./components/VoteCard";
import { useAccount } from "wagmi";
import Voting from './artifacts/contracts/Voting.sol/Voting.json';

function App() {
  const { address } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4 ">
      <div className="flex flex-col items-center">
        <ConnectButton showBalance={false} />
        <br/>
        {address && <VoteCard />}
      </div>
    </div>
  );
}

export default App;
