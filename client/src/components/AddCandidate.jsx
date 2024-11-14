import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getAddress } from "viem";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import toast from "react-hot-toast";
import { useReadContract, useWriteContract } from "wagmi";
import { contractAbi, contractAddress } from "../lib/utils";

const FormSchema = z.object({
  address: z
    .string()
    .min(42, {
      message: "Address must must be 42 characters.",
    })
    .max(42, "Address must be 42 characters"),
});

export function AddCandidate({ setOpen, refetch }) {
  const { writeContractAsync } = useWriteContract();

  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data) => {
    const result = await writeContractAsync({
      abi: contractAbi,
      address: contractAddress,
      functionName: "addCandidate",
      args: [getAddress(data.address)],
    });

    if (result) {
      refetch();
      setOpen(false);
      toast.success("Added success")
    }
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Add Candidate profile</DialogTitle>
        <DialogDescription>
          Give the currect informations. Click submit when you're done.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-3"
        >
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex: 0x00000000000000000000000000000"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Profession</FormLabel>
                <FormControl>
                  <Input placeholder="Profession" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem className="focus:bg-green-100" value="Active">
                      Active
                    </SelectItem>
                    <SelectItem className="focus:bg-orange-100" value="Pending">
                      Pending
                    </SelectItem>
                    <SelectItem className="focus:bg-red-100" value="Block">
                      Block
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
