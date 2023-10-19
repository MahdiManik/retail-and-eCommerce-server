const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("brand server is running");
});

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.rg5wc51.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const brandCollection = client.db("brandDB").collection("brand");
    const brandNameCollection = client
      .db("brandNameDB")
      .collection("brandName");

    app.get("/brand", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/brand/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brandCollection.findOne(query);
      res.send(result);
    });

    app.post("/brand", async (req, res) => {
      const brandProducts = req.body;
      console.log(brandProducts);
      const result = await brandCollection.insertOne(brandProducts);
      res.send(result);
    });

    app.post("/brandName", async (req, res) => {
      const brandProducts = req.body;
      console.log(brandProducts);
      const result = await brandNameCollection.insertOne(brandProducts);
      res.send(result);
    });

    app.get("/brandName", async (req, res) => {
      const cursor = brandNameCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/brandName/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brandNameCollection.findOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`brand server is running on port${port}`);
});
