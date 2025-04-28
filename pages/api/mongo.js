import mongoose from 'mongoose';

// MongoDB code
import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://UserGuy:${process.env.REACT_APP_DB_PASSWORD}@cluster0.5mbj5pg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
let clientPromise = client.connect();

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db('testdb');
  return { db, client };
}

// async function storeCheckin(items) {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     await client.close();
//   }
// }

// async function fetchCheckin() {
//   try {
//     const collection = db.collection('myCollection');
//     const data = await collection.find({}).toArray();
//     return res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch data' });
//     return null;
//   }
// }