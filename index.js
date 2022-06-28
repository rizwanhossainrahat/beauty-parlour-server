const express = require('express')
const app = express()
const cors=require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const port =process.env.PORT || 5000;

app.use(express.json());

app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iwcqk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
  try{
      await client.connect();
      const database = client.db("beauty-parlour");
      const appointmentsCollection=database.collection('appointments')
      const usersCollection=database.collection('users')
      const reviewsCollection=database.collection('reviews')

      // post use to send data from client site to server site
      app.post('/appointments',async(req,res)=>{
          const appointment=req.body;
          
          const result=await appointmentsCollection.insertOne(appointment)
          res.json(result)
      })
      
      app.post('/users',async(req,res)=>{
        const user=req.body;
        const result= await usersCollection.insertOne(user);
        
        res.json(result)
      })  
 
      app.get('/appointments',async(req,res)=>{
            const email=req.query.email;
            const query={email:email}
            const cursor=appointmentsCollection.find(query)
            const result=await cursor.toArray()
            res.json(result)
    })


    app.post('/reviews',async(req,res)=>{
      const review=req.body; 
      console.log('review',review)
      const result=await reviewsCollection.insertOne(review)
      res.json(result)
    })

    app.get('/reviews',async(req,res)=>{
      const cursor=reviewsCollection.find({});
      const review=await cursor.toArray();
      res.send(review)
    })

    app.put('/users/admin',async(req,res)=>{
        const user=req.body
        const requester= req.decodedEmail
        if(requester){
          const requesterAccount=await usersCollection.findOne({email:requester});
          if(requesterAccount.role==='admin'){

            const filter={email:user.email}
        const updateDoc={$set:{role:'admin'}}
        const result=await usersCollection.updateOne(filter,updateDoc);
        res.json(result); 
          }
        }
            else{
              res.status(403).json({message:'you do not have allow to make admin'})
            }     
      })

     


  }

  
  finally{
      // await client.close();
  }

}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello beauty parlour!')
})

app.listen(port, () => {
  console.log(` listening on port ${port}`)
})




// app.get('/users')
// app.post('/users')
// app.get('/users/:id') 
// app.put('/users/:id') user k update kore
// app.delete('/users/:id') user k delete kore
// upset google sign in ar somoy bebohar kora hoi jodi user thake tahole add korbe na. r jodi na thake tahole add korbe