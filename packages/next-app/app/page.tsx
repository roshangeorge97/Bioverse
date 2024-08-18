"use client";

import React from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/store";
import ConnectButton from "@/components/ConnectButton";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import Image from 'next/image'
import { useRouter } from 'next/navigation'


function Home() {
  
  const { username, setUsername } = useStore();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async () => {
  
    try {
      if (address) {
        const response = await axios.post("/api/claim-username", {
          username,
          address,
        });
        
        setUsername(response.data.username);
        console.log("Username claimed successfully");
  
        // Redirect to /username after successful submission
        router.push(`/${username}`);
      } else {
        console.log("Connect to a wallet to claim username");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="p-4 flex justify-between items-center">
        <div className="pl-12 text-2xl font-bold">Bioverse</div>
        <ConnectButton />
      </header>

      <main className="container mx-auto mt-20 flex">
        <div className="w-1/2 p-24 pl-48 pr-12">
          <h1 className="text-5xl font-bold mb-4">On chain payments done right.</h1>
          <p className="text-xl text-gray-400 mb-8">
            Powered by the Ethereum network, Bioverse is your one-stop gateway for receiving payments in crypto.
          </p>
          <div className="flex mb-4">
  <div className="bg-gray-800 rounded-l-lg px-4 py-3 text-gray-400 flex items-center border border-r-0 border-gray-700">
    bioverse.com/
  </div>
  <Input
  type="text"
  placeholder="username"
  value={username}
  onChange={handleInputChange}
  className="rounded-l-none rounded-r-lg bg-gray-800 border-gray-700 focus:ring-blue-500 focus:border-blue-500 flex-grow h-18"
/>

</div>
<Button 
  onClick={handleSubmit} 
  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg h-12"
>
  Get Started
</Button>
        </div>
        <div className="w-1/2 p-12 pl-0 pt-12 pb-0 items-center justify-center">
          <div className="relative w-full max-w-md">
            <Image src="/undraw_ether_re_y7ft.svg" alt="my profile" width="350" height="350" />
            {/* Optional: Add decorative elements or additional styling */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500 opacity-20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500 opacity-20 rounded-full blur-xl"></div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;