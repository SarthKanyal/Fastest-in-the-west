import { Client, Intents } from "discord.js";
import token from "./config.js";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
  console.log("Ready");
});

client.login(token.token);
