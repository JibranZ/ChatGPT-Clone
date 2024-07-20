const PORT = 8000;
import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.API_KEY;

app.post("/completions", async (req, res) => {
  try {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: req.body.message,
          },
        ],
        max_tokens: 100,
      }),
    };
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  } catch (err) {
    console.error(err);
  }
});

app.listen(PORT, () => console.log("Your server is running on PORT " + PORT));
