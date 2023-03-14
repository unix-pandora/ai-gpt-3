const axios = require("axios");
require("dotenv").config(); // 加载 .env 文件

async function robot(question) {
  const maxTokens = 2048;
  const temperature = 0.5;
  const topP = 0.5;
  const frequencyPenalty = 0.5;
  const presencePenalty = 0.5;
  const stop = "\n";
  const url = "https://api.openai.com/v1/engines/text-davinci-003/completions";

  const response = await axios({
    method: "POST",
    url: url,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_KEY}`, // 从 .env 文件中读取 API 密钥
    },
    data: JSON.stringify({
      prompt: question,
      max_tokens: maxTokens,
      temperature: temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      stop: stop,
    }),
  });
  const data = response.data;
  const text = data.choices[0].text;

  console.info(text);
  return text;
}

exports.robot = robot;
