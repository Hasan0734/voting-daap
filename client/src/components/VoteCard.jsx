import { Badge, Clock, Sparkles, ThumbsUp, Trophy } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  differenceInSeconds,
  formatDuration,
  fromUnixTime,
  getUnixTime,
  intervalToDuration,
} from "date-fns";
import TimeCountDown from "./TimeCountDown";
import DateCountdown from "./DateCountdown";

const votingOptions = [
  { id: "option1", name: "Interstellar", icon: "🚀" },
  { id: "option2", name: "Inception", icon: "🌀" },
  { id: "option3", name: "The Dark Knight", icon: "🦇" },
];

const VoteCard = ({ isVoting, startingTime, endingTime }) => {
  const [votes, setVotes] = useState({
    option1: 0,
    option2: 0,
    option3: 0,
  });
  const [voted, setVoted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [timeLeft, setTimeLeft] = useState();

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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1000) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVote = (option) => {
    if (!voted && timeLeft > 0) {
      setVotes((prev) => ({
        ...prev,
        [option]: prev[option] + 1,
      }));
      setVoted(true);
    }
  };

  const calculatePercentage = (votes) => {
    return totalVotes === 0 ? 0 : (votes / totalVotes) * 100;
  };

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();

      const duration = intervalToDuration({
        start: now,
        end: fromUnixTime(Number(endingTime)),
      });
      setTimeLeft(duration);
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [endingTime]);

  return (
    <>
      <Card className="w-full max-w-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6" />
            Movie Awards 2024
            <Sparkles className="w-6 h-6" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* {Number(startingTime) < getUnixTime(new Date()) ? (
            getUnixTime(new Date()) > Number(endingTime) ? (
              <p className="text-red-500 text-center text-xl font-semibold">
                Vote time end
              </p>
            ) : (
              <TimeCountDown time={timeLeft} />
            )
          ) : (
            <p>Time is comming </p>
          )} */}

              <DateCountdown targetDate={fromUnixTime(Number(endingTime))}/>

          {/* <div className="space-y-6">
            {votingOptions.map((option) => (
              <div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg flex items-center gap-2">
                    {option.icon} {option.name}
                  </span>
                  <Button
                    onClick={() => handleVote(option.id)}
                    disabled={voted || timeLeft?.hours === 0}
                    variant={
                      voted && votes[option.id] > 0 ? "default" : "outline"
                    }
                    className="transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    {voted && votes[option.id] > 0 ? (
                      <ThumbsUp className="mr-2 h-4 w-4" />
                    ) : null}
                    Vote
                  </Button>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-purple-200">
                    <div
                      style={{
                        width: `${calculatePercentage(votes[option.id])}%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                      initial={{ width: "0%" }}
                      animate={{
                        width: `${calculatePercentage(votes[option.id])}%`,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-600 flex justify-between items-center">
                  <span>{votes[option.id]} votes</span>
                  <Badge variant="secondary">
                    {calculatePercentage(votes[option.id]).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div> */}
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

