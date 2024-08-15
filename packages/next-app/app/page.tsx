"use client";

import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/store";
import ConnectButton from "@/components/ConnectButton";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";

function Home() {
  const { username, setUsername } = useStore();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (address) {
        console.log("Wallet connected");
      } else {
        console.log("connect to a wallet and claim username on that");
      }

      const response = await axios.post("/api/claim-username", {
        username,
        address,
      });
      setUsername(response.data.username);
      console.log("Username claimed successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data.error || "An error occurred");
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <>
      <ConnectButton />
      <div>Landing Page</div>
      <div className="w-36">
        <Input
          type="text"
          placeholder="/username"
          value={username}
          onChange={handleInputChange}
        />
        <Button onClick={handleSubmit}>Claim</Button>
      </div>
    </>
  );
}

export default Home;
