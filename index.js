const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uv9mv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5001;

app.get("/", (req, res) => {
  res.send("Working");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const users = client.db("volunteerNetwork").collection("volunteerInfos");
  app.post("/addUser", (req, res) => {
    const user = req.body;
    users.insertOne(user).then((result) => {});
  });
  app.get("/userinfos", (req, res) => {
    //console.log(req.query.email);
    users.find({ email: req.query.email }).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.delete("/delete/:id", (req, res) => {
    users.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {});
  });
  app.get("/userinfotable", (req, res) => {
    //console.log(req.query.email);
    users.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

app.listen(port);
