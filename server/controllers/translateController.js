const axios = require("axios");

const translateController = async (req, res) => {
  try {
    const sourceLanguageCode = req.body.sourceLanguageCode; // Assuming source language is in request body
    const targetLanguageCode = req.body.targetLanguageCode; // Assuming target language is in request body

    const url = "https://arnoj-translation-api.onrender.com/translate?text=" + encodeURIComponent(req.body.text) + "&sourceLanguageCode=" + sourceLanguageCode + "&targetLanguageCode=" + targetLanguageCode;

    const response = await axios.get(url);

    if (!response) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const translatedText = response.data.translatedText; // Access translated text using documented structure

    return res.status(200).json({ translatedText });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res
      .status(500)
      .json({ error: "Something went wrong!", message: error.message }); // Include error message
  }
};

module.exports = { translateController };
