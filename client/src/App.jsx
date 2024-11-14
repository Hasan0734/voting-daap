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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getUnixTime } from "date-fns";
import toast from "react-hot-toast";

const sidebarItems = [
  { id: 1, title: "Voter UI", icon: Cuboid },
  { id: 2, title: "Vote Date", icon: Calendar },
  { id: 3, title: "Candidates", icon: Users },
  { id: 4, title: "Votes", icon: Vote },
];

function App() {
  const { address } = useAccount();
  const [tabId, setTabId] = useState(1);

  const {  writeContractAsync } = useWriteContract();

  const { data: owner } = useReadContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: "owner",
    config: wagmiConfig,
  });

  const { data: startingTime, refetch:StatingTimeRefetch } = useReadContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: "startingTime",
    config: wagmiConfig,
  });

  const { data: endingTime, refetch:EndingTimeRefetch } = useReadContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: "endingTime",
    config: wagmiConfig,
  });
  const { data: isVoting, refetch:VotingRefetch } = useReadContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: "isVoting",
    config: wagmiConfig,
  });
  const { data: candidates, refetch:CandidateRefetch } = useReadContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: "getCandidatesVotes",
  });

  const toggleVote = async () => {
    if (Number(startingTime) > getUnixTime(new Date())) {
      toast.error("Too early to start voting!");
      return;
    }

    const result = await writeContractAsync({
      abi: contractAbi,
      address: contractAddress,
      functionName: "toggleVoting",
    });

    if(result) {
      VotingRefetch();
      toast.success("Voting started now.")
    }
  };

  const renderComponent = (id) => {
    switch (id) {
      case 1:
        return (
          <VoteCard
             refetch ={CandidateRefetch}
            candidates={candidates}
            isVoting={isVoting}
            startingTime={startingTime}
            endingTime={endingTime}
          />
        );
      case 2:
        return <VoteDate StatingTimeRefetch={StatingTimeRefetch} EndingTimeRefetch={EndingTimeRefetch} startingTime={startingTime} endingTime={endingTime} />;
      case 3:
        return <Candidates refetch={CandidateRefetch} candidates={candidates} />;
      case 4:
        return <Votes />;
      default:
        <VoteCard
          candidates={candidates}
          isVoting={isVoting}
          startingTime={startingTime}
          endingTime={endingTime}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4 ">
      <div className="flex flex-col items-center">
        {owner === address && address ? (
          <></>
        ) : (
          <ConnectButton showBalance={false} chainStatus="none" />
        )}
        <br />
        {address && (
          <>
            {owner === address ? (
              <Card className="flex flex-col md:flex-row gap-6 p-5 w-full max-w-7xl">
                <div className="border-r space-y-3 flex flex-col justify-between pr-4 w-72">
                  <div className="space-y-3 flex flex-col">
                    <h2 className="text-xl mb-4">System Control</h2>
                    {sidebarItems.map((item) => (
                      <Button
                        key={item.id}
                        onClick={() => {
                          setTabId(item.id);
                        }}
                        variant={item.id === tabId ? "" : "outline"}
                      >
                        <item.icon /> {item.title}
                      </Button>
                    ))}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant={"outline"}>{isVoting ? "Stop" : "Start"} Voting</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. The process is active
                            voting and inactive voting.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={toggleVote}>
                            Active
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <div className="flex justify-center">
                    <ConnectButton showBalance={false} chainStatus="none" />
                  </div>
                </div>

                {renderComponent(tabId)}
              </Card>
            ) : (
              <VoteCard
                candidates={candidates}
                isVoting={isVoting}
                startingTime={startingTime}
                endingTime={endingTime}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
