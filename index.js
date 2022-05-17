const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0ykxl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log("DB Connected");
    const servicesCollection = client
      .db("doctors_portal")
      .collection("services");
    const bookingCollection = client
      .db("doctors_portal")
      .collection("bookings");

    app.get("/service", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    /**
     * API Naming Convention
     * app.get('/booking')  // get all bookings in this collection. or get more than one or by filter
     * app.get('/booking/:id')  // get a specific booking
     * app.post('/booking') // add a new booking
     * app.patch('/booking/:id') // update a booking
     * app.delete('/booking/:id') // delete a booking
     */

    app.post("/booking", async (req, res) => {
      const booking = req.body;
      const query = {
        treatment: booking.treatment,
        date: booking.date,
        patient: booking.patient,
      };
      const exists = await bookingCollection.findOne(query);
      if (exists) {
        return res.send({ success: false, booking: exists });
      }
      const result = await bookingCollection.insertOne(booking);
      return res.send({ success: true, result });
    });

    // app.post("/booking", async (req, res) => {
    //   const booking = req.body;
    //   const query = {
    //     treatment: booking.treatment,
    //     date: booking.date,
    //     patient: booking.patient,
    //   };

    //   const exists = await bookingCollection.findOne(query);
    //   if (exists) {
    //     return res.send({ success: false, booking: exists });
    //   }
    //   const result = await bookingCollection.insertOne(booking);
    //   return res.send({ success: true, result });
    // });

    //
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Doctors Portal Server Running");
});

app.listen(port, () => {
  console.log(`Portal Server Running on port ${port}`);
});
