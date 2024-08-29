const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

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
        // await client.connect();
        const database = client.db("tourism_DB");
        const destinationCollections = database.collection("destinations");
        const holidayPackageCollections = database.collection("holiday_packages");
        const userBookingCollections = database.collection("user_bookings");

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
        app.get('/booking' , async(req,res)=>{
            const id = req.query.id;
            const query = {_id: new ObjectId(id)}
          
            const result = await destinationCollections.findOne(query);
            res.json(result)

        })
        app.get('/users' , async(req,res) => {
           
           
            const cursor = userBookingCollections.find({});
            const result = await cursor.toArray();
            res.json(result)
        })
        app.get('/userBookings' , async(req,res) => {
            const email = req.query.email;
            const query = {email:email}
            const cursor = userBookingCollections.find(query);
            const result = await cursor.toArray();
            res.json(result)
        })

        // POST API
        app.post('/addplace' , async (req,res) => {
            const docs = req.body;
            
            const result = await destinationCollections.insertOne(docs);

            res.json(result);

        })
        app.post('/userBookings' , async (req,res) => {
            const docs = req.body;
            
            const result = await userBookingCollections.insertOne(docs);

            res.json(result);

        })

        // Delete API 
        app.delete('/deleteUser' , async(req,res) => {
            const id = req.query.id;
            const query = {_id : new ObjectId(id)};
            const result = await userBookingCollections.deleteOne(query);

            res.json(result)


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