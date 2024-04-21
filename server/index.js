const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//  Middleware
app.use(cors());
app.use(express.json());

// Routes


// Listen
app.listen(5000, () => {
    console.log("Server has started on port 5000");
});