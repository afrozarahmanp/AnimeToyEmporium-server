const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.port || 3000;
require('dotenv').config()

app.use(cors())
app.use(express.json());


const alltoys = require('./Data/toys.json')

console.log(process.env.DB_USER)


const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z8idv4x.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db('AnimeToys').collection('alltoys');
    const orderCollection = client.db('AnimeToys').collection('ordertoys');

    app.get('/alltoys', async(req, res)=>{
      const cursor = toyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/alltoys/:id', async(req, res)=>{
    const id = req.params.id;
    const query = { _id: new ObjectId(id)};
    

    const result = await toyCollection.findOne(query);
    res.send(result);
    })

    // order

    app.get('/ordertoys', async(req, res)=>{

      let query = {};
        if(req.query?.email){
            query = {email: req.query.email}
        }

      const cursor = orderCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/ordertoys', async(req, res)=>{
      const order = req.body;
      console.log(order);
      const result = await orderCollection.insertOne(order);
      res.send(result)
  })


  app.delete('/ordertoys/:id', async(req, res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await orderCollection.deleteOne(query);
    res.send(result);

})



  



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Toys server is runnig')
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
  })