import { clsx } from "clsx"
import { twMerge } from "tailwind-merge";
import Voting from "../artifacts/contracts/Voting.sol/Voting.json";

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
export const contractAbi = Voting.abi;

export const createUnixFormat = (date, time) => {
  if (!date) return "Pick a date and time"
  const [hours, minutes] = time.split(":").map(Number)
  const dateTime = new Date(date)
  dateTime.setHours(hours, minutes)
  return Math.floor(dateTime.getTime() / 1000)
}