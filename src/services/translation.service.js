const axios = require("axios");

// Using free MyMemory API (no key required)
async function translateToEnglish(text) {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=es|en`;

    const response = await axios.get(url);

    return response.data.responseData.translatedText;

  } catch (error) {
    console.log("Translation error:", error.message);
    return text; // fallback
  }
}

module.exports = { translateToEnglish };
