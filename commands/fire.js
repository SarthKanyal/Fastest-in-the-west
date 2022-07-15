import { SlashCommandBuilder } from "@discordjs/builders";
import { DateTime } from "luxon";

const fire = {
  data: new SlashCommandBuilder()
    .setName("fire")
    .setDescription(
      "Enter the word displayed on screen to fire at your challenger"
    )
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("Type word displayed on screen and press enter ")
    ),
  async execute(interaction) {
    //console.log(interaction.client.player1, interaction.client.player2);

    const now = DateTime.utc();
    if (
      interaction.client.player1.id !== interaction.user.id &&
      interaction.client.player2.id !== interaction.user.id
    ) {
      interaction.reply("Nice try cowboy");
    } else if (
      !interaction.client.player1.played &&
      interaction.user.id === interaction.client.player1.id
    ) {
      interaction.client.player1.played = true;
      interaction.client.player1.input = interaction.options.data[0].value;

      interaction.client.player1.timestamp = now.toISO();
      //reply with a shoot b style message

      if (interaction.replied) {
        await interaction.followUp(
          `<@${interaction.user.id}> fires a well aimed shot at <@${interaction.client.player2.id}>`
        );
      } else {
        await interaction.reply(
          `<@${interaction.user.id}> fires a well aimed shot at <@${interaction.client.player2.id}>`
        );
      }
    } else if (
      !interaction.client.player2.played &&
      interaction.user.id === interaction.client.player2.id
    ) {
      interaction.client.player2.played = true;
      interaction.client.player2.input = interaction.options.data[0].value;

      interaction.client.player2.timestamp = now.toISO();

      if (interaction.replied) {
        await interaction.followUp(
          `<@${interaction.user.id}> fires a well aimed shot at <@${interaction.client.player1.id}>`
        );
      } else {
        await interaction.reply(
          `<@${interaction.user.id}> fires a well aimed shot at <@${interaction.client.player1.id}>`
        );
      }
    }

    if (
      interaction.client.player1.played &&
      interaction.client.player2.played
    ) {
      if (
        interaction.client.player1.timestamp <
        interaction.client.player2.timestamp
      ) {
        await interaction.followUp(
          `The winner of the duel is <@${interaction.client.player1.id}>`
        );
      } else if (
        interaction.client.player1.timestamp >
        interaction.client.player2.timestamp
      ) {
        await interaction.followUp(
          `The winner of the duel is <@${interaction.client.player2.id}>`
        );
      } else {
        await interaction.followUp(`Holy shit its a draw!`);
      }
    }
  },
};

export default fire;
