"use client";

import ConnectButton from "@/components/ConnectButton";
import Bioverse from "@/artifacts/contracts/Bioverse.sol/Bioverse.json";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Avvvatars from "avvvatars-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation"; // Import useRouter

const Page = ({ params }: { params: { username: string } }) => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [usernameExists, setUsernameExists] = useState(false);
  const [message, setMessage] = useState("");
  const [currency, setCurrency] = useState("");
  const [chain, setChain] = useState("");
  const [amount, setAmount] = useState("");
  const router = useRouter(); // Initialize useRouter

  // async function getBalance() {
  //   if (!isConnected) throw Error("User disconnected");

  //   const ethersProvider = new BrowserProvider(walletProvider!);
  //   const signer = await ethersProvider.getSigner();
  //   // The Contract object
  //   const USDTContract = new Contract(
  //     "0xa08A938d74FE6Cd7F2a9dffE1aC3E232d38A706F",
  //     Bioverse.abi,
  //     signer
  //   );
  //   const USDTBalance = await USDTContract.balanceOf(address);

  //   console.log(formatUnits(USDTBalance, 18));
  // }

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
    // const res = await BioverseContract.sendPayment(
    //   "0xe63cd6628cb18914e945d91d51db3f831d50fd25",
    //   "hii",
    //   { value: ethers.parseEther("0.00001") }
    // );

    // console.log(res);

    const postTx = async () => {
      try {
        const response = await axios.post("/api/transaction", {
          receipt: params.username,
          senderAddress: address,
        });
        // Assuming the server responds with status 200 for existing users
        setUsernameExists(true);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setUsernameExists(false);
        } else {
          console.error("An error occurred while checking the username", error);
        }
      }
    };

    postTx();
  }

  async function reqPayments() {
    const senderAddress = address;
    const receipt = params.username;
    try {
      const res = await axios.post("/api/notification", {
        receipt,
        senderAddress,
      });
      console.log("Res Notif", res);
    } catch (error) {
      console.error("An error occurred while requesting payment", error);
    }
  }

  async function handleRequestPayment() {
    try {
      const res = await axios.post("/api/notification", {
        receipt: params.username,
        senderAddress: address,
        message,
        currency,
        chain,
        amount,
      });
      console.log("Res Notif", res);
    } catch (error) {
      console.error("An error occurred while requesting payment", error);
    }
  }

  async function handleSendPayment() {
    if (!isConnected) throw Error("User disconnected");

    const response = await axios.get("/api/transaction", {
      params: { username: params.username, address: "" },
    });
    // Assuming the server responds with status 200 for existing users
    const receiptAddr = response.data.user.address;

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
    const res = await BioverseContract.sendPayment(receiptAddr, "hii", {
      value: ethers.parseEther(amount),
    });

    console.log(res);

    try {
      const res = await axios.post("/api/transaction", {
        receipt: params.username,
        senderAddress: address,
        message,
        currency,
        chain,
        amount,
      });
      console.log("Transaction sent", res);
    } catch (error) {
      console.error("An error occurred while sending payment", error);
    }
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
  useEffect(() => {
    const checkUsername = async () => {
      try {
        const response = await axios.get("/api/claim-username", {
          params: { username: params.username, address: "" },
        });
        setUsernameExists(true);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setUsernameExists(false);
        } else {
          console.error("An error occurred while checking the username", error);
        }
      }
    };

    checkUsername();
  }, [params.username]);

  return (
    <>
      {usernameExists ? (
        <div className="flex min-h-screen bg-gray-900 text-white">
          {/* Gradient sidebar */}
          <div className="w-1/3 bg-gradient-to-b from-purple-600 via-pink-600 to-red-600"></div>

          {/* Main content */}
          <div className="w-2/3 p-8 flex flex-col justify-center items-center">
            {/* "Go to Dashboard" button */}
            <div className="absolute top-4 left-4">
              <Button onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
            </div>

            <div className="absolute top-4 right-4">
              <ConnectButton />
            </div>
            <div className="flex flex-col items-center space-y-8 max-w-2xl w-full">
              <Avvvatars value={params.username} size={180} />
              <h1 className="text-4xl font-bold text-white">
                {params.username}
              </h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-48 h-14 text-xl font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                    Request Payment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Request Payment</DialogTitle>
                    <DialogDescription>
                      Enter the details for your payment request.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="message" className="text-right">
                        Message
                      </Label>
                      <Input
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="currency" className="text-right">
                        Currency
                      </Label>
                      <Input
                        id="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="chain" className="text-right">
                        Chain
                      </Label>
                      <Input
                        id="chain"
                        value={chain}
                        onChange={(e) => setChain(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="amount" className="text-right">
                        Amount
                      </Label>
                      <Input
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleRequestPayment}>Send Request</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <div className="flex justify-center space-x-8 w-full">
                {["ETC", "USDT", "USDC"].map((crypto) => (
                  <Dialog key={crypto}>
                    <DialogTrigger asChild>
                      <Button className="w-36 h-14 text-xl font-semibold rounded-lg bg-gray-700 hover:bg-gray-600 text-white">
                        {crypto}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Send {crypto} Payment</DialogTitle>
                        <DialogDescription>
                          Enter the details for your {crypto} payment.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="message" className="text-right">
                            Message
                          </Label>
                          <Input
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            Amount
                          </Label>
                          <Input
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleSendPayment}>
                          Send Payment
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          role="status"
          className="flex justify-center items-center w-full min-h-screen"
        >
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </>
  );
};

export default Page;
