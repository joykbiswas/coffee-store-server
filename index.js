const express = require('express');
const cors = require('cors')
const app =express();

require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())


// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cqpfzla.mongodb.net/?retryWrites=true&w=majority`;

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

    const coffeeCollection = client.db('coffeeDB').collection('coffee');

    const userCollection = client.db('coffeeDB').collection('user')

    //create 
    app.post('/coffee', async(req,res) =>{
        const newCoffee = req.body;
        console.log(newCoffee);
        const result = await coffeeCollection.insertOne(newCoffee)
        res.send(result)
    })

    // read data
    app.get('/coffee', async(req,res) =>{
        const cursor= coffeeCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    // update 
    app.get('/coffee/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query)
      res.send(result)
    })

    app.put("/coffee/:id", async(req,res) =>{
      const id =req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options ={upsert: true};
      const updatedCoffee = req.body;
      

      const coffee ={
        $set:{
          name: updatedCoffee.name,
          quantity: updatedCoffee.quantity,
          supplier: updatedCoffee.supplier,
          taste: updatedCoffee.taste,
           details: updatedCoffee.details,
          category: updatedCoffee.category,
          photo: updatedCoffee.photo
        }
      }
      
      const result =await coffeeCollection.updateOne(filter, coffee ,options)
      res.send(result)
      // console.log(result);
    })

    // delete 
    app.delete('/coffee/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result =await coffeeCollection.deleteOne(query)
      res.send(result)
    })


    // USER related apis

    //create user
    app.post('/user', async(req,res) =>{
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    // reade user
    app.get('/user', async(req,res) =>{
      const course= userCollection.find()
      const users = await course.toArray() 
      res.send(users)
    })

    //delete
    app.delete('/user/:id', async(req,res) =>{
      const id= req.params.id;
      const query ={_id: new ObjectId(id)}
      const  result = await userCollection.deleteOne(query)
      res.send(result)
    })

    //update user
    app.patch('/updateUser', async(req,res) =>{
      const user =req.body;
      console.log(user);
      const filter = {email:user.email}
      const updateDoc = {
        $set:{
          lastLoggedAt:user.lastLoggedAt
        }
      }
      const result = await userCollection.updateOne(filter,updateDoc)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res) =>{
    res.send('coffee making server is running')
})
app.listen(port,()=>{
    console.log(`coffee server is running on port:${port}` );
})