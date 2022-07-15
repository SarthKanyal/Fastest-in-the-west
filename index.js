import { Client, Intents } from "discord.js";
import { token } from "./config.js";
import dotenv from "dotenv";
dotenv.config();
import { ping, challenge, fire } from "./commands/index.js";
import { interactionCreate, ready } from "./events/index.js";
import { REST } from "@discordjs/rest";
import { deployCommands } from "./deploy-commands.js";
import mongoose from "mongoose";

const commandCollection = { ping, challenge, fire };
const eventCollection = { interactionCreate, ready };

const commands = Object.values(commandCollection).map((command) =>
  command.data.toJSON()
);
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = commands;
client.commandCollection = commandCollection;

try {
  await deployCommands();
} catch (error) {
  console.log(error);
}

try {
  const events = Object.entries(eventCollection);

  events.forEach((entry) => {
    if (entry[1].once === true) {
      client.once(entry[0], () => {
        entry[1].execute();
      });
      return;
    } else {
      client.on(entry[0], async (interaction) => {
        await entry[1].execute(interaction);
      });
    }
  });

  const filter1 = (message) => {
    console.log("entering filter");
    message.author.id === interaction.client.player1;
  };
} catch (error) {
  console.log(error);
}
const start = async () => {
  try {
    await client.login(token);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DATABASE_CONNECTED");
  } catch (error) {
    console.log(error);
  }
};

start();
