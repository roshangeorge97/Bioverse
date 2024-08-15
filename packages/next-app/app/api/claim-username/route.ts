import { NextResponse, NextRequest } from "next/server";
import { client, Document } from "@/lib/connectDb";
import mongoose from "mongoose";

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
    return NextResponse.json({ message: "User Exists" }, { status: 200 });
  } else {
    return NextResponse.json({ error: "User Not Exists" }, { status: 404 });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    // const collection = client.db("bioverse").collection("users");
    const { username, address } = body;
    const user = await Document.findOne({ user: username });
    let res = null;
    if (!user) {
      const newUser = new Document({
        _id: new mongoose.Types.ObjectId().toString(), // Generate a new _id
        user: username, // Ensure this is provided and valid
        address: address,
        transactions: [], // Assuming transactions is an array of transaction objects
      });
      res = await newUser.save();

      // res = await Document.insertMany({
      //   user: username,
      //   address,
      //   transactions: [],
      // });
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
