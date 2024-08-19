"use client";

import React, { useEffect, useState } from "react";
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
import { Scheduled, columns, dummyData } from "./columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import axios from "axios";
import { DataTable } from "./data-table";

const Page = () => {
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const [scheduled, setScheduled] = useState<Scheduled[]>([]);
  const [position, setPosition] = React.useState("monthly");

  useEffect(() => {
    const checkUsername = async () => {
      try {
        const response = await axios.get("/api/scheduled", {
          params: { username: "", address },
        });
        // Assuming the server responds with status 200 for existing users
        setScheduled(response.data.user.scheduled);

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
      you&apos;re free
      <div>Scheduled Payments</div>
      <Dialog>
        <DialogTrigger asChild>
          <button className="relative inline-flex h-14 overflow-hidden rounded-full p-[3px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Create New Request
            </span>
          </button>
          {/* <Button>
          <FaPlus className="mr-5" /> Create New Request
        </Button> */}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Payments</DialogTitle>
            <DialogDescription>
              Schedule your Payments request here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skills" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                className="ml-5 w-60 max-w-lg"
                placeholder="username"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Message
              </Label>
              <Input
                id="message"
                placeholder="message"
                className="ml-5 w-60 max-w-lg"
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="github" className="text-right">
                Currency
              </Label>
              <Input
                id="currency"
                placeholder="currency"
                className="ml-5 w-60 max-w-lg"
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                placeholder="amount"
                className="ml-5 w-60 max-w-lg"
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="interval" className="text-right">
                Interval
              </Label>
              <div className="ml-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Schedule</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Schedule for Every</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={position}
                      onValueChange={setPosition}
                    >
                      <DropdownMenuRadioItem value="top">
                        Month
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="bottom">
                        Week
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="right">
                        Day
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
            <div>
              <Button variant="outline">Cancel</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={scheduled} />
      </div>
    </>
  );
};


export default Page;
