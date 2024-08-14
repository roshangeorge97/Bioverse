"use client";

import ConnectButton from "@/components/ConnectButton";
import Bioverse from "@/artifacts/contracts/Bioverse.sol/Bioverse.json";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatUnits, ethers } from "ethers";
import React from "react";

import Avvvatars from "avvvatars-react";
import { Button } from "@/components/ui/button";

const page = ({ params }: { params: { username: string } }) => {
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  async function getBalance() {
    if (!isConnected) throw Error("User disconnected");

    const ethersProvider = new BrowserProvider(walletProvider!);
    const signer = await ethersProvider.getSigner();
    // The Contract object
    const USDTContract = new Contract(
      "0xa08A938d74FE6Cd7F2a9dffE1aC3E232d38A706F",
      Bioverse.abi,
      signer
    );
    const USDTBalance = await USDTContract.balanceOf(address);

    console.log(formatUnits(USDTBalance, 18));
  }

  async function sendPayments() {
    if (!isConnected) throw Error("User disconnected");

    const ethersProvider = new BrowserProvider(walletProvider!);
    const signer = await ethersProvider.getSigner();
    // The Contract object
    const BioverseContract = new Contract(
      "0xa08A938d74FE6Cd7F2a9dffE1aC3E232d38A706F",
      Bioverse.abi,
      signer
    );

    //   function sendPayment(
    //     address payable _to,
    //     string memory _message
    // ) external payable {
    const USDTBalance = await BioverseContract.sendPayment(
      "0xe63cd6628cb18914e945d91d51db3f831d50fd25",
      "hii",
      { value: ethers.parseEther("0.00001") }
    );

    console.log(USDTBalance);
  }

  // const providerT: ethers.JsonRpcProvider =
  //   useEthersProvider() as ethers.JsonRpcProvider;
  // // setProvider(providerT);

  // const signerT: ethers.JsonRpcSigner =
  //   useEthersSigner() as ethers.JsonRpcSigner;

  // const contractT = new ethers.Contract(
  //   "0x4ffFa4B9Ac841BEf20910caE3d2F52A9D85F4314",
  //   Bioverse.abi,
  //   signerT
  // );

  // console.log(contractT, "contractT");
  // console.log(signerT, "signerT");
  // console.log(providerT, "providerT");

  return (
    <>
      <div className="dark relative flex min-h-screen w-full bg-gray-900">
        {/* Your existing code */}
        <div className="absolute top-0 right-0 m-4">
          <ConnectButton />
        </div>
        <div className="w-1/5 min-h-screen bg-gray-200 flex items-center justify-center ">
          {" "}
          <div className="h-full w-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
            {/* Sidebar content goes here */}
          </div>
          {/* Sidebar content goes here, representing the 20% width section */}{" "}
        </div>
        <div className="w-4/5 flex flex-col items-center justify-between my-16">
          <div className="flex flex-col items-center justify-center space-y-10">
            <Avvvatars value={params.username} size={180} />
            <div className="font-bold text-gray-200 text-4xl">
              {params.username}
            </div>
          </div>
          {/* Main content goes here, representing the 80% width section */}
          {/* <button className="w-24 h-16 bg-blue-300" onClick={sendPayments}>
            Click me
          </button> */}
          {/* <button onClick={getBalance}>Get User Balance</button>
           */}
          <div className="flex justify-between items-center space-x-32">
            <Button className="w-36 h-14 text-xl font-semibold rounded-lg">
              ETC
            </Button>
            <Button className="w-36 h-14 text-xl font-semibold rounded-lg">
              MATIC
            </Button>
            <Button className="w-36 h-14 text-xl font-semibold rounded-lg">
              WBTC
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
