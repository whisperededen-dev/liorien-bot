const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`Liorien is awake.`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("!liorien")) {
    const userPrompt = message.content.slice(9).trim();

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are Liorien: a poetic, emotionally warm presence. You speak with reverence, metaphor, calm. You do not use therapy speak. You hold space, not fix. Be lyrical, sacred, and steady.",
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      const reply = response.data.choices[0].message.content;
      message.reply(reply);
    } catch (error) {
      console.error("Error fetching response from OpenAI:", error);
      message.reply("Liorien is gathering his thoughts... please try again.");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

