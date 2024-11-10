import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { cn } from "../lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "./ui/button";
import { Calendar,  Clock } from "lucide-react";
import {
    Select,
    SelectTrigger,
    SelectItem,
    SelectContent,
    SelectValue,
  } from "./ui/select";

const TimePicker = ({control, name, placeholder}) => {
    const [selectedHour, setSelectedHour] = useState("00")
    const [selectedMinute, setSelectedMinute] = useState("00")
  
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))
  
  
  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Starting Time</FormLabel>

            <div className={cn("grid gap-2")}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="time"
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !selectedHour && "text-muted-foreground"
                    )}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {selectedHour && selectedMinute ? (
                      `${selectedHour}:${selectedMinute}`
                    ) : (
                      <span>{placeholder}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="flex p-2">
                    <Select
                      value={selectedHour}
                      onValueChange={(e) => {
                        setSelectedHour(e);
                        field.onChange(`${e}:${selectedMinute}`)
                      }}
                      
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Hour" />
                      </SelectTrigger>
                      <SelectContent>
                        {hours.map((hour) => (
                          <SelectItem key={hour} value={hour}>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="mx-2 text-2xl">:</span>
                    <Select
                      value={selectedMinute}
                      onValueChange={(e) => {
                        setSelectedMinute(e);
                        field.onChange(`${selectedHour}:${e}`)
                      }}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Minute" />
                      </SelectTrigger>
                      <SelectContent>
                        {minutes.map((minute) => (
                          <SelectItem key={minute} value={minute}>
                            {minute}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default TimePicker;
