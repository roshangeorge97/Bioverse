"use client";

import ConnectButton from "@/components/ConnectButton";
import Bioverse from "@/artifacts/contracts/Bioverse.sol/Bioverse.json";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatUnits, ethers } from "ethers";
import React from "react";

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
      <div>{params.username}</div>
      <ConnectButton />
      <button className="w-24 h-16 bg-blue-300" onClick={sendPayments}>
        Click me
      </button>
      <button onClick={getBalance}>Get User Balance</button>
    </>
  );
};

export default page;
