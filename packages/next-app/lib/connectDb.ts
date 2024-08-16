import { MongoClient } from "mongodb";
import { Schema, models, model } from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
}

// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.

interface User {
  username: string;
  address: string;
}

interface Transaction {
  sender: string;
  message: string;
  currency: string;
  chain: string;
  amount: string;
  date: Date;
}

const documentSchema = new Schema({
  _id: String,
  user: { type: String, required: true },
  address: { type: String, required: true },
  transactions: [
    {
      sender: String,
      message: String,
      currency: String,
      chain: String,
      amount: String,
      date: Date,
    },

    { _id: false },
  ],
  notifications: [
    {
      sender: String,
      message: String,
      currency: String,
      chain: String,
      amount: String,
      date: Date,
    },
    { _id: false },
  ],
});

const Document = models.User ?? model("User", documentSchema);

export { client, Document };
