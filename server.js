import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

const {Schema, model} = mongoose

const reservationSchema = new Schema({
  guestName: {
    type: String,
    required: true,
    minLength: 4
  },
  guestPhone: {
    type: String,
    required: true,
    minLength: 10
  },
  date: {
    type: Date,
    required: true
  },
  partySize: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  }
})

const Reservation = model ("Reservation", reservationSchema)
// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.post("/reservations", async (req, res) => {
  //destructure what we need from the body
  const{guestName, guestPhone, date, partySize} = req.body

  try {
    const reservation = await new Reservation({guestName, guestPhone, date, partySize}).save()

    //set success status
    res.status(201).json({
      success: true,
      response: reservation,
      message: "Reservation created successfully."
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Reservation couldn't be made."
    })
  }
})

console.log(new Date())
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
