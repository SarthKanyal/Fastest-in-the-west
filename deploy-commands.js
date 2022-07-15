import { SlashCommandBuilder } from "@discordjs/builders";
import { ping, challenge, fire } from "./commands/index.js";

import { Routes } from "discord-api-types/v9";
import { REST } from "@discordjs/rest";
import { applicationId, guildId, token } from "./config.js";

const commandCollection = { ping, challenge, fire };

const commands = Object.values(commandCollection).map((command) =>
  command.data.toJSON()
);
const rest = new REST({ version: "9" }).setToken(token);

export const deployCommands = async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
      body: commands,
    });
    console.log("COMMANDS_INSTALLED");
  } catch (error) {
    console.log(error);
  }
};
