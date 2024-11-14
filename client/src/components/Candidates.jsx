import React, { useState } from "react";
import { MoreHorizontal, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { AddCandidate } from "./AddCandidate";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { contractAbi, contractAddress } from "../lib/utils";
import { useReadContract } from "wagmi";

// This would typically come from an API or database
// const candidates = [
//   {
//     id: 1,
//     name: "Alex Johnson",
//     role: "Frontend Developer",
//     experience: "5",
//     status: "Active",
//   },
//   {
//     id: 2,
//     name: "Sam Lee",
//     role: "UX Designer",
//     experience: "3",
//     status: "Active",
//   },
//   {
//     id: 3,
//     name: "Taylor Swift",
//     role: "Project Manager",
//     experience: "7",
//     status: "Active",
//   },
//   {
//     id: 4,
//     name: "Jordan Patel",
//     role: "Backend Developer",
//     experience: "4",
//     status: "In Review",
//   },
//   {
//     id: 5,
//     name: "Casey Kim",
//     role: "Data Scientist",
//     experience: "2",
//     status: "Active",
//   },
// ];

const Candidates = ({candidates, refetch}) => {
  const [open, setOpen] = useState(false)

  const [searchTerm, setSearchTerm] = useState("");






  // const filteredCandidates = candidates.filter((candidate) =>
  //   candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <>
      <Card className="w-full p-4">
        <div className="flex items-center justify-between space-y-2 mb-4">
          <h2 className="text-3xl font-bold tracking-tight">Candidates</h2>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button size="icon" variant="ghost">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={25} /> Add
              </Button>
            </DialogTrigger>
            <AddCandidate refetch={refetch} setOpen={setOpen}/>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Vote</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates?.map((candidate) => (
                <TableRow key={candidate.candidate}>
                  <TableCell className="font-medium">
                    {candidate.candidate}
                  </TableCell>
                  <TableCell>Farmer</TableCell>
                  <TableCell>{Number(candidate.votesCount)}</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Mark as Hired</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Reject Application
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
};

export default Candidates;
