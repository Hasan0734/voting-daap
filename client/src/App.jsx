import { ConnectButton } from "@rainbow-me/rainbowkit";
import VoteCard from "./components/VoteCard";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import Voting from "./artifacts/contracts/Voting.sol/Voting.json";
import wagmiConfig from "./config/wagmiConfig";
import { Button } from "./components/ui/button";
import { useEffect, useState } from "react";
import { Card } from "./components/ui/card";
import { Calendar, Cuboid, Users, Vote } from "lucide-react";
import VoteDate from "./components/VoteDate";
import Candidates from "./components/Candidates";
import Votes from "./components/Votes";

const sidebarItems = [
  { id: 1, title: "Voter UI", icon: Cuboid},
  { id: 2, title: "Vote Date", icon: Calendar},
  { id: 3, title: "Candidates", icon: Users},
  { id: 4, title: "Votes", icon: Vote},
];

function App() {
  const { address } = useAccount();
  const [tabId, setTabId] = useState(1);

  const { data: owner } = useReadContract({
    abi: Voting.abi,
    address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    functionName: "owner",
    config: wagmiConfig,
  });

  const { writeContract } = useWriteContract();


  const handleOwner = async () => {
    //   writeContract({
    //     abi: Voting.abi,
    //     address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    //     functionName: 'addCandidate',
    //     args: [
    //       '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    //     ],
    //  })
  };


  const renderComponent = (id) => {
    switch(id){
      case 1:
        return <VoteCard/>
        break;
      case 2: 
        return <VoteDate/>
        break;
      case 3:
        return <Candidates/>
        break;
      case 4: 
        return <Votes/>
        break;
      default:
        <VoteCard/>
      }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4 ">
      <div className="flex flex-col items-center">
        {!address && <ConnectButton chainStatus="none" />}
        <br />
        {address && (
          <>
            {owner === address ? (
              <Card className="flex gap-6 p-5">
                <div className="border-r space-y-3 flex flex-col justify-between pr-4 w-60">
                  <div className="space-y-3 flex flex-col">
                    <h2 className="text-xl mb-4">System Control</h2>
                    {sidebarItems.map((item) => (
                      <Button
                        key={item.id}
                        onClick={() => setTabId(item.id)}
                        variant={item.id === tabId ? "" : "outline"}
                      >
                        <item.icon /> {item.title}
                      </Button>
                    ))}
                  </div>
                  <ConnectButton showBalance={false} chainStatus="none" />
                </div>

                {renderComponent(tabId)}
              </Card>
            ) : (
              <VoteCard />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
