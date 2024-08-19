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
    const { receipt, senderAddress } = body;

    if (!receipt || !senderAddress) {
      console.error("Missing receipt or senderAddress in the request body");
      return NextResponse.json(
        { error: "Missing data in request body" },
        { status: 400 }
      );
    }

    const receiptDoc = await Document.findOne({ user: receipt });
    const senderDoc = await Document.findOne({ address: senderAddress });

    if (!receiptDoc || !senderDoc) {
      console.error("Either receipt or sender document not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const scheduled = {
      username: receiptDoc.user,
      message: "",
      forEvery: "",
      currency: "",
      chain: "",
      amount: "",
      date: new Date(),
    };

    const tx = {
      sender: senderDoc.user,
      message: "",
      currency: "",
      chain: "",
      amount: "",
      date: new Date(),
    };

    senderDoc.scheduled.push(scheduled);
    await senderDoc.save();

    receiptDoc.transactions.push(tx);
    await receiptDoc.save();

    return NextResponse.json(
      { message: "Operation successful" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
