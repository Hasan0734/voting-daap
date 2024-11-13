import { ConnectButton } from "@rainbow-me/rainbowkit";
import VoteCard from "./components/VoteCard";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import wagmiConfig from "./config/wagmiConfig";
import { Button } from "./components/ui/button";
import { useEffect, useState } from "react";
import { Card } from "./components/ui/card";
import { Calendar, Cuboid, Users, Vote } from "lucide-react";
import VoteDate from "./components/VoteDate";
import Candidates from "./components/Candidates";
import Votes from "./components/Votes";
import { contractAbi, contractAddress } from "./lib/utils";

const sidebarItems = [
  { id: 1, title: "Voter UI", icon: Cuboid},
  { id: 2, title: "Vote Date", icon: Calendar},
  { id: 3, title: "Candidates", icon: Users},
  { id: 4, title: "Votes", icon: Vote},
];

function App() {
  const { address, chainId } = useAccount();
  const [tabId, setTabId] = useState(1);

  const { data: owner } = useReadContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: "owner",
    config: wagmiConfig,
  });


  const { data: startingTime } = useReadContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: "startingTime",
    config: wagmiConfig,
  }, {uint: 'number'});

  const { data: endingTime } = useReadContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: "endingTime",
    config: wagmiConfig,
  });
  const { data: isVoting } = useReadContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: "isVoting",
    config: wagmiConfig,
  });



  console.log(startingTime, endingTime, isVoting)




  const renderComponent = (id) => {
    switch(id){
      case 1:
        return <VoteCard isVoting={isVoting} startingTime={startingTime} endingTime={endingTime}/>
      case 2: 
        return <VoteDate startingTime={startingTime} endingTime={endingTime}/>
      case 3:
        return <Candidates/>
      case 4: 
        return <Votes/>
      default:
        <VoteCard/>
      }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4 ">
      <div className="flex flex-col items-center">
        { owner === address && address  ? <></>: <ConnectButton showBalance={false  } chainStatus="none" />}
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
                        onClick={() => {
                          setTabId(item.id)
                          
                        }}
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
