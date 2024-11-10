import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import { Form } from "./ui/form";
import { contractAbi, contractAddress, createUnixFormat } from "../lib/utils";
import { useReadContract, useWriteContract } from "wagmi";
import wagmiConfig from "../config/wagmiConfig";

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

  const {data:hash,error, writeContract} = useWriteContract();
  const {data:isVoting} = useReadContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: "startingDate",
    config:wagmiConfig
  })

  const form = useForm({
    resolver: zodResolver(FormSchema),
  });




  function onSubmit(data) {
    console.log(data)
    const start = createUnixFormat(data.startingDate, data.startingTime);
    const end = createUnixFormat(data.endingDate, data.endingTime)
       writeContract({
        abi: contractAbi,
        address: contractAddress,
        functionName: 'setDate',
        args: [start, end]
     })

  };

  console.log(hash, error)
  

console.log(isVoting)


  return (
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
              <DatePicker control={form.control} name={"startingDate"} placeholder={'Pick start date'}/>
              <TimePicker control={form.control} name={"startingTime"} placeholder={'Pick a time'}/>
            </div>
            <div className="flex gap-5">
              <DatePicker control={form.control} name={"endingDate"} placeholder={'Pick end date'}/>
              <TimePicker control={form.control} name={"endingTime"} placeholder={'Pick a time'}/>
            </div>

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VoteDate;
