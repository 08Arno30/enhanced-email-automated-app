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
app.use("/users", userRoutes);

const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", false);

// connect
mongoose.connect(`${process.env.REACT_APP_MONGO_DB_URL}`).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.log(error);
})