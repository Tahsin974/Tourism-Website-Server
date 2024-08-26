const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors = require('cors');

const app = express();

const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3lwmdbh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// middleware
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

async function run (){
    try{
        await client.connect();
        const database = client.db("tourism_DB");
        const destinationCollections = database.collection("destinations");
        const holidayPackageCollections = database.collection("holiday_packages");

        // GET API
        app.get('/destinations' , async(req,res)=>{
            const cursor = destinationCollections.find({});
            const destinations = await cursor.toArray();

            res.json(destinations);

        })
        app.get('/packages' , async(req,res)=>{
            const cursor = holidayPackageCollections.find({});
            const packages = await cursor.toArray();

            res.json(packages);

        })

    }
    finally{
        // await client.close();

    }
}
run().catch(console.dir)

app.get('/' , (req,res) =>{
    res.send("Welcome to tourism server")
})

app.listen(port , ()=>{
    console.log("Listening to the port",port)
})