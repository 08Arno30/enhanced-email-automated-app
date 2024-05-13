require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const emailRoutes = require("./routes/emailRoutes");
const bodyParser = require("body-parser");
const allowedOrigins = [
  "https://enhanced-email-automated-app-frontend.onrender.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}

//  Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
    res.send("Server running");
})
app.use("/api/users", userRoutes);
app.use("/api/emails", emailRoutes);

const PORT = process.env.REACT_APP_PORT || 5000;

mongoose.set("strictQuery", false);

// connect
mongoose
  .connect(`${process.env.REACT_APP_MONGO_DB_URI}`)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });