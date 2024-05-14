const translateController = async (req, res) => {
  try {
    const sourceLanguageCode = req.body.sourceLanguageCode; // Assuming source language is in request body
    const targetLanguageCode = req.body.targetLanguageCode; // Assuming target language is in request body
    const text = encodeURIComponent(req.body.text);

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguageCode}&tl=${targetLanguageCode}&dt=t&q=${text}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data[0][0][0]) {
      throw new Error("No translation data found"); // Check for translations key
    }

    const translatedText = data[0][0][0]; // Access translated text using documented structure

    return res.status(200).json({ translatedText });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res
      .status(500)
      .json({ error: "Something went wrong!", message: error.message }); // Include error message
  }
};

module.exports = { translateController };
