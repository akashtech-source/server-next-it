const express = require('express')
const app = express()
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

require('dotenv').config()

const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());

console.log(process.env.DB_USER);
app.get('/', (req, res) => {
  res.send('Next IT')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.apc6x.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("theNext").collection("service");
  const bookingCollection = client.db("theNext").collection("bookings");
  const adminCollection = client.db("theNext").collection("admin");
  
  console.log("database connected successfully");
  
  app.get('/service', (req, res) => {
    serviceCollection.find()
    .toArray((err, items) => {
      res.send(items)
      console.log(items);
    })
  })

  

  app.get('/booking', (req, res) => {
    // console.log(req.query.email)
    bookingCollection.find({email: req.query.email})
    .toArray((err, items)=> {
      res.send(items)
      console.log('fro db', items);
    })
  })

  app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log("adding service", newService);
    serviceCollection.insertOne(newService)
    .then(result => {
      console.log('inserted', result.insertedCount);
      res.send(result.insertedCount > 0);
    })
  })
  

  // perform actions on the collection object
//   client.close();
app.get(`/booking/:id`, (req, res)=> {
  serviceCollection.find({
    _id: ObjectID(req.params.id)
  })
  .toArray((err, items)=> {
    res.send(items)
    console.log(items);
  })
})

app.post('/addReview', (req, res) => {
  const newReview = req.body;
  console.log('review', newReview);
  serviceCollection.insertOne(newReview)
  .then(result => {
    console.log('inserted', result.insertedCount);
    res.send(result.insertedCount > 0);
  })
})

app.post('/addBookings', (req, res) => {
  const newBooking = req.body;
  console.log('booking', newBooking);
  bookingCollection.insertOne(newBooking)
  .then(result => {
    console.log('ins count', result.insertedCount);
    res.send(result.insertedCount > 0);
  })

  app.delete('/delete/:id', (req, res) => {
    // serviceCollection.deleteOne({_id: ObjectID(req.params.id)})
    console.log(req.params.id)
  })
})

app.post('/addAdmin', (req, res) => {
  const newAdmin = req.body;
  console.log('admin', newAdmin);
  adminCollection.insertOne(newAdmin)
 
})

app.get('/admin', (req, res) => {
  // console.log(req.query.email)
  adminCollection.find()
  .toArray((err, items)=> {
    res.send(items)
    console.log('fro db', items);
  })
})


});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})