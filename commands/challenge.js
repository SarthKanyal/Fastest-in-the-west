import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageButton } from "discord.js";

const challenge = {
  data: new SlashCommandBuilder()
    .setName("challenge")
    .setDescription("Replies with an accept challenge button")
    .addStringOption((option) =>
      option
        .setName("difficulty")
        .setDescription("Pick shootout difficulty")
        .setRequired(true)
        .setChoices(
          { name: "Easy", value: "easy" },
          { name: "Medium", value: "medium" },
          { name: "Hard", value: "hard" }
        )
    ),
  async execute(interaction) {
    console.log(interaction.id);
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("accept_challenge")
        .setLabel("Accept")
        .setStyle("SECONDARY")
    );

    const [name, value] = [
      interaction.options.data[0].name,
      interaction.options.data[0].value,
    ];

    await interaction.reply({
      content: `Do you accept <@${interaction.user.id}>'s challenge for a level ${value} duel?`,
      components: [row],
    });
  },
};

export default challenge;
