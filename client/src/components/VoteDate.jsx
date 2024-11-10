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
import {
  useReadContract,
  useTransactionConfirmations,
  useWriteContract,
} from "wagmi";
import wagmiConfig from "../config/wagmiConfig";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { formatUnits } from 'viem'

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

const VoteDate = () => {
  const {
    data: dateHash,
    writeContractAsync,
  } = useWriteContract();

  const { status } = useTransactionConfirmations({ hash: dateHash });

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

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      startingDate: startingTime ? format(new Date(Number(startingTime)), 'ddMMyyyyy') : ''
    },
    reValidateMode: true
  });

  const onSubmit = (data) => {
    const start = createUnixFormat(data.startingDate, data.startingTime);
    const end = createUnixFormat(data.endingDate, data.endingTime);

    // writeContract({
    //   abi: contractAbi,
    //   address: contractAddress,
    //   functionName: "setDate",
    //   args: [start, end],
    // });

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
 


  console.log({startingTime, endingTime})

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
                  control={form.control}
                  name={"endingTime"}
                  placeholder={"Pick a time"}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit">Submit</Button>
               {dateHash && <Button className="text-green-500" type="button" variant="outline">
                  {status}
                </Button>}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default VoteDate;
