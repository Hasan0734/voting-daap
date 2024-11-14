import React from "react";

import { useState, useEffect } from "react";
import {
  differenceInSeconds,
  fromUnixTime,
  getUnixTime,
  intervalToDuration,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

const DateCountdown = ({
  targetDate = new Date(Date.now() + 7 * 22 * 60 * 60 * 1000),
  isVoting, title
}) => {
  const calculateTimeLeft = () => differenceInSeconds(targetDate, new Date());

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = calculateTimeLeft();
      if (difference > 0) {
        setTimeLeft(difference);
      } else {
        clearInterval(timer);
        setTimeLeft(0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const duration = intervalToDuration({ start: new Date(), end: targetDate });

  const formatNumber = (num) => (num || 0).toString().padStart(2, "0");

  const days = Math.floor(calculateTimeLeft() / (24 * 60 * 60));


  return (
    <>
      <div className="w-full max-w-md mx-auto pb-4 relative">
          <div className="absolute right-0">
          <Badge variant={"outline"} className={isVoting ?"text-green-500" : "text-red-500"}>{isVoting ? "Active" : "Inactive"}</Badge>
          </div>
          <h2 className="text-2xl font-bold text-center py-3">
           {title}
          </h2>
        <>
          <div className="grid grid-cols-4 gap-4 text-center">
            {[
              { label: "Days", value: days },
              { label: "Hours", value: duration.hours },
              { label: "Minutes", value: duration.minutes },
              { label: "Seconds", value: duration.seconds },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center">
                <div className={cn(' text-4xl font-bold text-primary mb-2', {"text-red-400": timeLeft === 0})}>
                  {timeLeft > 0 ?  formatNumber(value): '00'}
                </div>
                <div className={cn("text-sm text-muted-foreground", {"text-red-400": timeLeft === 0})}>{label}</div>
              </div>
            ))}
          </div>
        
        </>
      </div>
    </>
  );
};

export default DateCountdown;
