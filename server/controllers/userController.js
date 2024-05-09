const jwt = require("jsonwebtoken");
const axios = require("axios");

const User = require("../models/userModel");

const signinController = async (req, res) => {
  if (req.body.accessToken) {
    // google-auth
    const googleAccessToken = req.body.accessToken;

    axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      })
      .then(async (response) => {
        const user_firstName = response.data.given_name;
        const user_lastName = response.data.family_name;
        const user_email = response.data.email;
        const user_picture = response.data.picture;

        // count number of documents with the same email
        const count = await User.countDocuments();
        let existingUser = null;
        
        if (count === 0) {
          // create new user
          const result = await User.create({
            user_firstname: user_firstName,
            user_lastname: user_lastName,
            email: user_email,
            user_picture: user_picture,
          });

          existingUser = result;

          const token = jwt.sign(
            {
              email: existingUser.email,
              id: existingUser._id,
            },
            process.env.REACT_APP_JWT_SECRET,
            { expiresIn: "1d" }
          );

          return res.status(200).json({ result: existingUser, token });
        }
        else {
          existingUser = await User.findOne({ email: user_email });
          const token = jwt.sign(
            {
              email: existingUser.email,
              id: existingUser._id,
            },
            process.env.REACT_APP_JWT_SECRET,
            { expiresIn: "1d" }
          );
  
          return res.status(200).json({ result: existingUser, token });
        }
      })
      .catch((err) => {
        res.status(400).json({ message: "Invalid access token!" });
        console.log(err);
      });
  }
};

const checkToken = async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.json({ valid: false });
  }
  else {
    jwt.verify(token, process.env.REACT_APP_JWT_SECRET, (err, decoded) => {
      if (err && err.name === "TokenExpiredError") {
        return res.json({ valid: false, message: "Token expired" });
      }

      if (err) {
        return res.json({ valid: false, message: "Invalid token" });
      }

      return res.json({ valid: true, user: jwt.decode(token) });
    });
  }
};

const getUser = async (req, res) => {
  const count = await User.countDocuments();

  if (count === 0) {
    return res.status(200).json({ user: null });
  }

  const user = await User.findOne({ email: req.query.email });

  if (!user) {
    return res.status(200).json({ user: null });
  }

  return res.status(200).json({ user });
};

const getAllUsers = async (req, res) => {
  const count = await User.countDocuments();

  if (count === 0) {
    return res.status(200).json({ users: null });
  }

  const users = await User.find();

  if (!users) {
    return res.status(200).json({ users: null });
  }

  return res.status(200).json({ users });
}

module.exports = {
  signinController,
  checkToken,
  getUser,
  getAllUsers,
};
