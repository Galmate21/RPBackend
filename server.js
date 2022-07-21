const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const cors=require('cors');
const ObjectId = require("mongodb").ObjectID;
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const FelhasznaloRoute=require('./routes/FelhasznaloRoute');
const Felhasznalo=require('./models/felhasznalok');
//corsolás
app.use(cors({
    origin: '*'
  }));

  require('dotenv').config();
  app.use(bodyParser.json());
app.use(express.json());

mongoose.connect(process.env.MONGO, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})

app.use('/felhasznalo',FelhasznaloRoute);

  function getClient() {
    const MongoClient = require("mongodb").MongoClient;
    const uri =
      process.env.MONGO;
    return new MongoClient(uri, { useNewUrlParser: true });
  }

  function getId(raw) {
    try {
      return new ObjectId(raw);
    } catch (err) {
      return "";
    }
  }

  //get foods
  app.get("/foods", function (req, res) {
  
    const client = getClient();
    client.connect(async (err) => {
      const collection = client.db(process.env.DB).collection(process.env.Food);
      const foods = await collection
      .find()
      .toArray();
      res.send(foods);
      client.close();
    });
  });
  //get food by ID

  app.get("/food/:id", function (req, res) {
    const id = getId(req.params.id);
  if (!id) {
    res.send({ error: "invalid id" });
    return;
  }
  
    const client = getClient();
    client.connect(async (err) => {
      const collection = client.db(process.env.DB).collection(process.env.Food);
      const food = await collection.findOne({ _id: id });
      if (!food) {
        res.send({ error: "not found" });
        return;
      }
      res.send(food);
      client.close();
    });
  });

  //get foods by type
  app.get("/foods/:type", function (req, res) {
    const type =req.params.type;
  
    const client = getClient();
    client.connect(async (err) => {
      const collection = client.db(process.env.DB).collection(process.env.Food);
      const foodsByType = await collection.find({ Type: type }).toArray();
      if (!foodsByType) {
        res.send({ error: "not found" });
        return;
      }
      res.send(foodsByType);
      client.close();
    });
  });

  //Order Post

  app.post("/Order", bodyParser.json(), function (req, res) {
    const body={
      _id:req.body.asztal,
      rendelesek:req.body.kosar,
      osszeg:req.body.osszeg,
      Afa27:req.body.Afa27,
      koret:req.body.koret
    }
  
  const client = getClient();
    client.connect(async (err) => {
      const collection = client.db(process.env.DB).collection(process.env.Order);
      const result = await collection.insertOne(body);
      if (!result) {
        res.send({ error: "insert error" });
        return;
      }
      res.send(body);
      client.close();
    });
  });


  //Get orders
  app.get("/orders", function (req, res) {
  
    const client = getClient();
    client.connect(async (err) => {
      const collection = client.db(process.env.DB).collection(process.env.Order);
      const foods = await collection
      .find()
      .toArray();
      res.send(foods);
      client.close();
    });
  });

//order put

app.put("/UpdateOrder/:id", bodyParser.json(), function (req, res) {
  const ujTermek = {
    
    rendelesek:req.body.order,
    osszeg:req.body.osszeg,
    Afa27:req.body.Afa27,
    koret:req.body.koret,
    
  }
  const id = req.params.id;
  if (!id) {
    res.send({ error: "invalid id" });
    return;
  }

  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db(process.env.DB).collection(process.env.Order);
    const result = await collection.findOneAndUpdate(
      { _id: id },
      { $set: ujTermek }
    );

    if (!result.ok) {
      res.send({ error: "not found" });
      return;
    }
    res.send(result.value);
    client.close();
  });
});

//get orders by id
app.get("/order/:id", function (req, res) {
  const id = req.params.id;
if (!id) {
  res.send({ error: "invalid id" });
  return;
}

  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db(process.env.DB).collection(process.env.Order);
    const food = await collection.findOne({ _id: id });
    if (!food) {
      res.send({ error: "not found" });
      return;
    }
    res.send(food);
    client.close();
  });
});


//delete order

app.delete("/orderDel/:id", function (req, res) {
  const id = req.params.id;
  if (!id) {
    res.send({ error: "invalid id" });
    return;
  }

  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db(process.env.DB).collection(process.env.Order);
    const result = await collection.deleteOne({ _id: id });
    if (!result.deletedCount) {
      res.send({ error: "not found" });
      return;
    }
    res.send({ id: req.params.id });
    client.close();
  });
});

//OrderClose trigger
app.post("/copyOrder", bodyParser.json(), function (req, res) {
  const body={
    date:req.body.fullDate,
    rendelesek:req.body.rendelesek,
    koret:req.body.koret
  }

const client = getClient();
  client.connect(async (err) => {
    const collection = client.db(process.env.DB).collection(process.env.Statistics);
    const result = await collection.insertOne(body);
    if (!result) {
      res.send({ error: "insert error" });
      return;
    }
    res.send(body);
    client.close();
  });
});


//get Stat by date
app.get("/stat/:date", function (req, res) {
  const date =req.params.date;

  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db(process.env.DB).collection(process.env.Statistics);
    const statbyID = await collection.find({ date: date }).toArray();
    if (!statbyID) {
      res.send({ error: "not found" });
      return;
    }
    res.send(statbyID);
    client.close();
  });
});



  console.log("A szerver fut az 5501 as porton");

app.listen(process.env.PORT||5501);