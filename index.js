const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = 5000
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eiwu5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const booksCollection = client.db("books-list").collection("books");
  //Post method
  app.post("/add", (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const description = req.body.description;

    booksCollection.insertOne({ title, author, description })
      .then(result => {
        console.log("one product added")
        res.send(result.insertedCount > 0)
      })
  })

  //Get method
  app.get('/books', (req, res) => {
    booksCollection.find({})
      .toArray((err, document) => {
        res.send(document);
      })
  })

  //Single data load for update

  app.get('/book/:id', (req, res) => {
    booksCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, document) => {
        res.send(document[0]);
      })
  })

  //Update method

  app.patch('/update/:id',(req, res)=>{

    console.log(req.body)
    booksCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {title:req.body.title, author: req.body.author, description:req.body.description}
    })
    .then(result=>{
      console.log(result);
      res.send(result.insertedCount > 0)
    })
  })

  //Delete method

  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id)
    booksCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
});


app.get('/', (req, res) => {
  res.send('Hello World shaker!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})