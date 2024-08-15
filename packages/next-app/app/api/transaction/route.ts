import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { client, Document } from "@/lib/connectDb";

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  throw new Error("MONGODB_URI is not defined in the environment variables.");
}

mongoose.connect(mongoURI).then(() => console.log("Connected! to db"));

// Adjusted GET handler in route.ts to use query parameters
export const GET = async (request: NextRequest) => {
  const url = request.nextUrl;
  const username = url.searchParams.get("username");
  const address = url.searchParams.get("address");

  // const collection = client.db("bioverse").collection("users");
  let user = null;
  if (username) {
    user = await Document.findOne({ user: username });
  } else if (address) {
    user = await Document.findOne({ address: address });
  }

  if (user) {
    return NextResponse.json(
      { message: "User Exists", user: user },
      { status: 200 }
    );
  } else {
    return NextResponse.json({ error: "User Not Exists" }, { status: 404 });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    // const collection = client.db("bioverse").collection("transactions");

    const { receipt, senderAddress } = body;
    const receiptDoc = await Document.findOne({ user: receipt });
    const senderDoc = await Document.findOne({ address: senderAddress });

    let res = null;
    if (receiptDoc) {
      const transaction = {
        sender: senderDoc.user,
        message: "",
        currency: "",
        chain: "",
        amount: "",
        date: new Date(),
      };

      receiptDoc.transactions.push(transaction);
      res = await receiptDoc.save();
    }

    if (res) {
      return NextResponse.json(
        {
          message: "Operation successful",
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: "Error on creating Account" },
        { status: 409 }
      );
    }
  } catch (error) {
    console.error("Error in register:", error);
    return NextResponse.json(
      { error: "Error on creating Account" },
      { status: 500 }
    );
  }
};
