const express=require('express')
const app= express()
const cors=require('cors')
const jwt= require("jsonwebtoken")
require('dotenv').config()
const port=process.env.PORT||5000
const { MongoClient, ServerApiVersion } = require('mongodb');

// midle aware
app.use(express.json())
app.use(cors())


console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sayatpw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {

  const authHeader = req.headers.authorization;
  if (!authHeader) {
      return res.status(401).send('unauthorized access');
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
      if (err) {
          return res.status(403).send({ message: 'forbidden access' })
      }
      req.decoded = decoded;
      next();
  })

}

  async function run(){
    
const signupUserInfo=client.db('kreedyTask').collection('signup')


    try{


        app.post('/register', async(req, res)=>{
            const query=req.body
            const result= await signupUserInfo.insertOne(query)
            res.send(result)
        })




          // jwt====
          app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await signupUserInfo.findOne(query);
         console.log(user);
         if (user) {
            const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '24h' })
            return res.send({ accessToken: token });
        }
        res.status(403).send({ accessToken: '' })
        });
    }
    finally{

    }






  }

  run().catch((e)=>{console.error(e)})
  







app.get('/', async(req, res)=>{
    res.send("hello bro")
})




app.listen(port, ()=>{
    console.log(port, `server is running`);
})