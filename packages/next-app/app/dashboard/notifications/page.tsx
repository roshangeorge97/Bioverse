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
import { Notification, columns, dummyData } from "./columns";
import { DataTable } from "./data-table";
import axios from "axios";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";

const page = () => {
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const checkUsername = async () => {
      try {
        const response = await axios.get("/api/notification", {
          params: { username: "", address },
        });
        // Assuming the server responds with status 200 for existing users
        setNotifications(response.data.user.notifications);

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
      <div>Notifications / Payment Requests</div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={notifications} />
      </div>
    </>
  );
};

export default page;
