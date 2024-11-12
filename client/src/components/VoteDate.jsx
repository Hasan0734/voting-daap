import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import { Form } from "./ui/form";
import { contractAbi, contractAddress, createUnixFormat } from "../lib/utils";
import { useTransactionConfirmations, useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import { fromUnixTime, format } from "date-fns";

const FormSchema = z.object({
  startingDate: z.date({
    required_error: "",
  }),
  startingTime: z.string().default("00:00"),
  endingDate: z.date({
    required_error: "",
  }),
  endingTime: z.string().default("00:00"),
});

const VoteDate = ({ startingTime, endingTime }) => {
  const { data: dateHash, error, writeContractAsync } = useWriteContract();
  const { status, isLoading } = useTransactionConfirmations({ hash: dateHash });

  const isStartingTime = Number(startingTime);
  const isEndingTime = Number(endingTime)

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      startingDate: startingTime ? fromUnixTime(isStartingTime) : '',
      endingDate: endingTime ? fromUnixTime(isEndingTime): '',
      startingTime:
      isStartingTime ? format(fromUnixTime(isStartingTime), "HH:mm") : "00:00",
      endingTime:
      isEndingTime ? format(fromUnixTime(isEndingTime), "HH:mm") : "00:00",
    },
  });

  const onSubmit = (data) => {
    const start = createUnixFormat(data.startingDate, data.startingTime);
    const end = createUnixFormat(data.endingDate, data.endingTime);
    toast.promise(
      
      writeContractAsync({
        abi: contractAbi,
        address: contractAddress,
        functionName: "setDate",
        args: [start, end],
      }),
      {
        loading: "Loading",
        success: "Date added successfully",
        error: "Error to submit the date",
      }
    );
  };

  console.log({status, isLoading})



  return (
    <>
      <Card className="w-full min-w-[445px] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
            Vote Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 mt-6"
            >
              <div className="flex gap-5">
                <DatePicker
                  control={form.control}
                  name={"startingDate"}
                  placeholder={"Pick start date"}
                />
                <TimePicker
                  hour={
                    isStartingTime &&
                    format(fromUnixTime(isStartingTime), "HH")
                  }
                  minute={
                    isStartingTime &&
                    format(fromUnixTime(isStartingTime), "mm")
                  }
                  control={form.control}
                  name={"startingTime"}
                  placeholder={"Pick a time"}
                />
              </div>
              <div className="flex gap-5">
                <DatePicker
                  control={form.control}
                  name={"endingDate"}
                  placeholder={"Pick end date"}
                />
                <TimePicker
                  hour={
                    isEndingTime && format(fromUnixTime(isEndingTime), "HH")
                  }
                  minute={
                   isEndingTime && format(fromUnixTime(isEndingTime), "mm")
                  }
                  control={form.control}
                  name={"endingTime"}
                  placeholder={"Pick a time"}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit">Submit</Button>
                {dateHash && (
                  <Button
                    className="text-green-500"
                    type="button"
                    variant="outline"
                  >
                    {status}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default VoteDate;
