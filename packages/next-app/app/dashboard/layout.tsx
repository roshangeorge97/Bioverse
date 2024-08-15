"use client";
import ConnectButton from "@/components/ConnectButton";
import { AnimatePresence, type HTMLMotionProps, motion } from "framer-motion";
import Link from "next/link";
import type React from "react";
import { type HTMLAttributes, useState } from "react";

const dataButtons = [
  { label: "Transactions", href: "/dashboard/transactions" },
  { label: "User Profile", href: "/dashboard/user-profile" },
  { label: "Scheduled Payments", href: "/dashboard/scheduled-payments" },
  { label: "Notifications", href: "/dashboard/notifications" },
  { label: "Settings", href: "/dashboard/settings" },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const [parentFocused, setParentFocused] = useState<boolean>(false);
  const [elementFocused, setElementFocused] = useState<number>(0);

  const handleOnClickButton = (index: number) => {
    setElementFocused(index);
  };
  return (
    <div className="relative flex min-h-screen w-full">
      <div className="absolute top-0 right-0 m-4">
        <ConnectButton />
      </div>
      <div className="flex flex-col w-1/6 items-start justify-between">
        <nav className="space-y-3 p-6">
          {dataButtons.map((button, index) =>
            button.label !== "Settings" ? (
              <Link
                // type="button"
                href={button.href}
                key={button.label}
                onClick={() => handleOnClickButton(index)}
                className={`${
                  elementFocused === index
                    ? "text-gray-300"
                    : "text-neutral-400"
                } text-sm font-medium py-1 px-2 rounded relative whitespace-nowrap inline-flex h-10 hover:text-gray-300 transition-colors w-full`}
              >
                {button.label}
                <AnimatePresence>
                  {elementFocused === index && (
                    <motion.div
                      className="absolute top-0 left-0 right-0 bottom-0 bg-neutral-700 text-gray-300 rounded-lg -z-10"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      layout
                      layoutId="focused-element"
                    />
                  )}
                </AnimatePresence>
              </Link>
            ) : null
          )}
        </nav>
        <div className="space-y-3 p-6 w-full">
          {dataButtons.map((button, index) =>
            button.label === "Settings" ? (
              <Link
                href={"/dashboard/settings"}
                key={"Settings"}
                onClick={() => handleOnClickButton(index)}
                className={`${
                  elementFocused === index
                    ? "text-gray-300"
                    : "text-neutral-400"
                } text-sm font-medium py-1 px-2 rounded relative whitespace-nowrap inline-flex h-10 hover:text-gray-300 transition-colors w-full`}
              >
                {button.label}
                <AnimatePresence>
                  {elementFocused === index && (
                    <motion.div
                      className="absolute top-0 left-0 right-0 bottom-0 bg-neutral-700 text-gray-300 rounded-lg -z-10"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      layout
                      layoutId="focused-element"
                    />
                  )}
                </AnimatePresence>
              </Link>
            ) : null
          )}
        </div>
      </div>
      <div className="w-5/6 flex-grow p-6 md:overflow-y-auto md:p-12">
        {children}
      </div>
    </div>
  );
}
