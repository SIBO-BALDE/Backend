          //Création d'un api
          //import express 
import express  from "express";
import mongoose from "mongoose";
import data from "./data.js";
//import dotenv
import * as dotenv from 'dotenv'
import seedRouter from "./Routes/seedRouter.js";
import productRouter from "./Routes/productRoutes.js";
import userRouter from "./Routes/userRoutes.js";
import orderRouter from "./Routes/orderRoutes .js";
import uploadRouter from "./routes/uploadRoutes.js";
import path from "path";

//on peut importer comme sa :import dotenv from "dotenv";

//to fetch variable in .env file
dotenv.config()

// On peut faire comme sa aussi:const url=process.env.MONGODB_URI
//mongoose.connect(url,{})
//.then(()=>console.log('db connect')
//)
//.catch((err)=>{
  //  console.log(err.message) })

  // then est la fonction mongoose retoune une promess et catch ratrappe l'erreur
  mongoose
  .connect(process.env.MONGODB_URI)
  .then(()=> {
    console.log('connected to db')
})
.catch((err)=>{
    console.log(err.message)
});

        // Create express application ,express is a function just all it to returan object which is
       // the express app

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get('/api/keys/paypal', (req, res)=> {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb');  
});

app.get("/api/keys/google", (req, res) => {
    res.send({ key: process.env.GOOGLE_API_KEY || "" });
  });
app.use("/api/upload", uploadRouter);

app.use('/api/seed',seedRouter);
      //This object has a methode named get and this methode has two parameter
     //the url that we are going to serve and the seconde parameter is the function that respond
    //the api when user go to this address we need to return products to the frontend to the user this function
   //the function accept two parameter requestand response object and inside this we need use 
  // res. send()to sen data in the frontend

 
// app.get('/api/products', (req, res) => {
//     res.send(data.products);
// });
app.use('/api/products',productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
);




//Condition pour verifier l'erreur du user routes
app.use((err, req,res, next) => {
    res.status(500).send({message:err.message});
});
 
      //Define the port we are t respond
const port = process.env.PORT || 5000;
     //call app.listen the server will be ready to response first parameter is the port et the seconde is the  callback
app.listen(port, () =>{
    console.log(`serve at http://localhost:${port}`);
    
});



















