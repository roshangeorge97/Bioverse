"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define an interface for the dummy data
export interface Scheduled {
  username: string;
  message: string;
  currency: string;
  chain: string;
  amount: string;
  date: Date;
}

export const columns: ColumnDef<Scheduled>[] = [
  {
    id: "dateAndTime", // Unique ID for this column
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          onClick={() =>
            column.toggleSorting(
              !column.getIsSorted() || column.getIsSorted() === "desc"
            )
          }
        >
          Date & Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: "datetime",
    // sortingFn: (rowA, rowB) => {
    //   const dateA = new Date(rowA.original.date);
    //   const dateB = new Date(rowB.original.date);
    //   return dateA.getTime() - dateB.getTime();
    // },
    cell: ({ row }) => {
      // Assuming your row data has date and time in ISO format or similar
      // You might need to adjust based on your actual data structure
      const date = new Date(row.original.date); // Replace 'date' with your actual date field
      const formattedDate = date.toLocaleDateString();
      const formattedTime = date.toLocaleTimeString();
      return `${formattedDate} ${formattedTime}`;
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "message",
    header: "Message",
  },
  {
    accessorKey: "forEvery",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          For Every
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "currency",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Currency
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "chain",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Chain
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => `${info.getValue()} ${info.row.original.currency}`,
  },
];

// Create dummy data using the defined interface
export const dummyData: Scheduled[] = [
  {
    username: "Alice",
    message: "Payment for services",
    currency: "ETH",
    chain: "Ethereum",
    amount: "0.5",
    date: new Date("2023-04-01T12:00:00Z"), // Changed to Date object
  },
  {
    username: "Bob",
    message: "Refund",
    currency: "BTC",
    chain: "Bitcoin",
    amount: "0.1",
    date: new Date("2023-04-02T15:30:00Z"), // Changed to Date object
  },
  {
    username: "Charlie",
    message: "Donation",
    currency: "ADA",
    chain: "Cardano",
    amount: "100",
    date: new Date("2023-04-03T18:45:00Z"), // Changed to Date object
  },
  {
    username: "Diana",
    message: "Subscription",
    currency: "USDT",
    chain: "Ethereum",
    amount: "50",
    date: new Date("2023-04-04T20:00:00Z"), // Changed to Date object
  },
  {
    username: "Evan",
    message: "Gift",
    currency: "SOL",
    chain: "Solana",
    amount: "2",
    date: new Date("2023-04-05T08:15:00Z"), // Changed to Date object
  },
];
