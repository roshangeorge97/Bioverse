"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction, columns, dummyData } from "./columns";
import { DataTable } from "./data-table";
import axios from "axios";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";

const Page = () => {
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const [tx, setTxs] = useState<Transaction[]>([]);

  useEffect(() => {
    const checkUsername = async () => {
      try {
        const response = await axios.get("/api/transaction", {
          params: { username: "", address },
        });
        // Assuming the server responds with status 200 for existing users
        setTxs(response.data.user.transactions);

        // setUsernameExists(true);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          // setUsernameExists(false);
        } else {
          console.error("An error occurred while checking the username", error);
        }
      }
    };

    checkUsername();
  }, [address]);

  return (
    <>
      <div>Transactions</div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={tx} />
      </div>
    </>
  );
};

export default Page;
