const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const validateMessages = (messages) => {
  if (!Array.isArray(messages)) {
    return { isValid: false, message: '"messages" must be an array.' };
  }

  for (const msg of messages) {
    if (typeof msg !== "object" || msg === null) {
      return { isValid: false, message: "Each element must be an object." };
    }

    const { role, content } = msg;

    if (!["system", "user", "assistant"].includes(role)) {
      return {
        isValid: false,
        message: '"role" must be "system", "user", or "assistant".',
      };
    }

    if (typeof content !== "string" || content.trim() === "") {
      return {
        isValid: false,
        message: '"content" not empty and must be a string.',
      };
    }
  }

  return { isValid: true, message: "All ok." };
};

app.post("/", async (req, res) => {
  try {
    const { messages } = req.body;

    const validation = validateMessages(messages);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          statusCode: 400,
          msg: validation.message,
        },
      });
    }

    const apiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(apiResponse.data.choices[0].message);
  } catch (error) {
    return res.status(error?.status || 500).json({
      success: false,
      error: {
        statusCode: error?.status || 500,
        msg: error?.response?.data?.error?.message,
      },
    });
  }
});

app.listen(9984, () => {
  console.log(`Server run!`);
});
