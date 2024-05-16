const jwt = require("jsonwebtoken");
const axios = require("axios");
const ISO6391 = require("iso-639-1");

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
        } else {
          existingUser = await User.findOne({ email: user_email });

          if (!existingUser) {
            // create new user
            const result = await User.create({
              user_firstname: user_firstName,
              user_lastname: user_lastName,
              email: user_email,
              user_picture: user_picture,
              folders: [],
            });

            existingUser = result;
          }

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
  } else {
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

  let user = null;

  if (!req.query.email && req.query.userID) {
    user = await User.findOne({ _id: req.query.userID });
  } else if (req.query.email) {
    user = await User.findOne({ email: req.query.email });
  }

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
};

const addFolder = async (req, res) => {
  try {
    const result = await User.updateOne(
      { _id: req.body.userID },
      { $push: { folders: req.body.folderName } }
    );

    if (!result) {
      return res.status(500).json({ message: "Something went wrong!" });
    }

    return res.status(200).json({ result: result, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Something went wrong!" });
  }
};

const deleteFolder = async (req, res) => {
  try {
    const result = await User.updateOne(
      { _id: req.body.userID },
      { $pull: { folders: req.body.folderName } }
    );

    if (!result) {
      return res.status(500).json({ message: "Something went wrong!" });
    }

    return res.status(200).json({ result: result, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Something went wrong!" });
  }
};

const renameFolder = async (req, res) => {
  try {
    const { userID, oldFolderName, newFolderName } = req.body;

    // Validate input data (optional but recommended)
    if (!userID || !oldFolderName || !newFolderName) {
      return res.status(400).json({
        message:
          "Missing required fields: userID, oldFolderName, newFolderName",
      });
    }

    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const folderIndex = user.folders.findIndex(
      (folder) => folder === oldFolderName
    );

    if (folderIndex === -1) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Update folder name in-place (avoids unnecessary array creation)
    user.folders[folderIndex] = newFolderName;

    await user.save();

    return res
      .status(200)
      .json({ status: "success", message: "Folder renamed successfully" });
  } catch (error) {
    console.error("Error renaming folder:", error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

const updateLanguage = async (req, res) => {
  try {
    const codeForLanguage = ISO6391.getCode(req.body.language);
    const result = await User.updateOne(
      { _id: req.body.userID },
      { $set: { preferred_language: codeForLanguage } }
    );

    if (!result) {
      return res.status(500).json({ message: "Something went wrong!" });
    }

    return res.status(200).json({ result: result, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Something went wrong!" });
  }
};

const addEmail = async (req, res) => {
  try {
    const result = await User.updateOne(
      { _id: req.body.userID },
      { $push: { emails: req.body.email } }
    );

    if (!result) {
      return res.status(500).json({ message: "Something went wrong!" });
    }

    return res.status(200).json({ result: result, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Something went wrong!" });
  }
};

const removeEmail = async (req, res) => {
  try {
    const email = req.body.email;
    const result = await User.updateOne(
      { _id: req.body.userID },
      { $pull: { emails: { _id: email._id } } }
    );

    if (!result) {
      return res.status(500).json({ message: "Something went wrong!" });
    }

    return res.status(200).json({ result: result, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Something went wrong!" });
  }
};

const updateEmail = async (req, res) => {
  try {
    const userID = req.body.userID;
    const email = req.body.newEmail;
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const emailIndex = user.emails.findIndex((e) => e._id === email._id);

    if (emailIndex === -1) {
      return res.status(404).json({ message: "Email not found" });
    }

    user.emails[emailIndex] = email;

    await user.save();

    return res
      .status(200)
      .json({ status: "success", message: "Emails updated successfully" });
  } catch (error) {
    console.error("Error updating emails:", error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports = {
  signinController,
  checkToken,
  getUser,
  getAllUsers,
  addFolder,
  deleteFolder,
  renameFolder,
  updateLanguage,
  addEmail,
  removeEmail,
  updateEmail,
};
