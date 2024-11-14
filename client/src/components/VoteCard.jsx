import { Badge,  Sparkles, ThumbsUp, Trophy } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  fromUnixTime,
  getUnixTime,
} from "date-fns";

import DateCountdown from "./DateCountdown";
import { useWriteContract } from "wagmi";
import { contractAbi, contractAddress } from "@/lib/utils";
import toast from "react-hot-toast";

const votingOptions = [
  { id: "option1", name: "Interstellar", icon: "🚀" },
  { id: "option2", name: "Inception", icon: "🌀" },
  { id: "option3", name: "The Dark Knight", icon: "🦇" },
];

const VoteCard = ({ isVoting, startingTime, endingTime, candidates, refetch }) => {
  const [votes, setVotes] = useState({
    option1: 0,
    option2: 0,
    option3: 0,
  });
  const [voted, setVoted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [timeLeft, setTimeLeft] = useState();
  const {writeContractAsync} = useWriteContract();

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  useEffect(() => {
    const maxVotes = Math.max(...Object.values(votes));
    const winningOption = Object.entries(votes).find(
      ([_, count]) => count === maxVotes
    );
    setWinner(
      winningOption
        ? votingOptions.find((option) => option.id === winningOption[0])
        : null
    );
  }, [votes]);



  const handleVote = async(option, index) => {
    console.log(option, index)

    console.log(Number(endingTime) < getUnixTime(new Date()))

    const res = await writeContractAsync({
      abi:contractAbi,
      address: contractAddress,
      functionName: "castVote",
      args:[index]
    })

    if(res){
      refetch()
      toast.success("Vote Casted")
      return
    }
    toast.error("Already vote casted")

  };

  const calculatePercentage = (votes) => {
    return totalVotes === 0 ? 0 : (votes / totalVotes) * 100;
  };




  return (
    <>
      <Card className="w-full md:min-w-[445px] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6" />
            Voting 2024
            <Sparkles className="w-6 h-6" />
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pt-4">
          {Number(startingTime) < getUnixTime(new Date()) ? (
            // <TimeCountDown time={timeLeft} />
            <DateCountdown
              isVoting={isVoting}
              title={"Time Remaining"}
              targetDate={fromUnixTime(Number(endingTime))}
            />
          ) : (
            <DateCountdown
            isVoting={isVoting}
            title={"Comming soon"}
            targetDate={fromUnixTime(Number(startingTime))}
          />
          )}
          <hr />
          <div className="space-y-6 mt-4">
            {candidates?.map((option,i) => (
              <div
                key={option.candidate}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2 border-b pb-1"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg flex items-center gap-2">
                    {option.candidate.slice(0, 5)}..
                    {option.candidate.slice(
                      option.candidate.length - 5,
                      option.candidate.length
                    )}
                  </span>
                  <Button onClick={() => handleVote(option, i)} className="transition-all duration-300 ease-in-out transform hover:scale-105">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Vote
                  </Button>
                </div>

                <div className="text-sm text-gray-600 flex justify-between items-center">
                  <span>{0} votes</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 font-medium">
              Total votes: {totalVotes}
            </p>
            {winner && (
              <div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-4"
              >
                <p className="text-xl font-bold text-purple-600 flex items-center justify-center gap-2">
                  <Trophy className="w-6 h-6" />
                  {timeLeft === 0 ? "Winner" : "Current Leader"}: {winner.name}{" "}
                  {winner.icon}
                </p>
              </div>
            )}
          </div>
          {timeLeft === 0 && (
            <div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-center"
            >
              <Badge variant="destructive" className="text-lg p-2">
                Voting Closed
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default VoteCard;
