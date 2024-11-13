import React from "react";

import { useState, useEffect } from "react";
import { differenceInSeconds, fromUnixTime, getUnixTime, intervalToDuration } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DateCountdown = ({
  targetDate = getUnixTime(new Date(Date.now() + 7 * 22 * 60 * 60 * 1000)),
}) => {

    console.log({targetDate})


  const [timeLeft, setTimeLeft] = useState(
    differenceInSeconds(targetDate, new Date())
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = differenceInSeconds(targetDate, new Date());
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

  console.log(duration)

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Time Remaining
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            {[
              { label: "Days", value: duration.days },
              { label: "Hours", value: duration.hours },
              { label: "Minutes", value: duration.minutes },
              { label: "Seconds", value: duration.seconds },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {formatNumber(value)}
                </div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / (7 * 24 * 60 * 60)) * 100}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DateCountdown;
