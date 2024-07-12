const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "sk-proj-HRh6nXA4XLfhlsC78qc3T3BlbkFJCjLOOnDFnfcbYwQybN0l";
const API_URL = "https://api.openai.com/v1/chat/completions";

app.post("/chat", async (req, res) => {
  const { messages } = req.body;
  try {
    const apiResponse = await axios.post(
      API_URL,
      {
        model: "gpt-3.5-turbo", // Ensure you are using a correct and accessible model
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(apiResponse.data);
  } catch (error) {
    console.error(
      "Error when calling OpenAI API:",
      error.response ? error.response.data : error
    );
    res.status(500).send("Internal Server Error: Unable to process request");
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
