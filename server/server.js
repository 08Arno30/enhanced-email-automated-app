require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

//  Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/", (req, res) => {
    res.send("Server running");
})
app.use("/users", userRoutes);

const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", false);

// connect
mongoose
  .connect(`${process.env.MONGO_DB_URI}`)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });