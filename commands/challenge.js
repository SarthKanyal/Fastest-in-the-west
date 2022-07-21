import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageButton } from "discord.js";
import { DateTime } from "luxon";
import Game from "../models/Game.js";

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
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(
          `accept_challenge_${interaction.id}_${interaction.options.data[0].value}`
        )
        .setLabel("Accept")
        .setStyle("SECONDARY")
    );

    // const aggregate = await Game.aggregate([
    //   {
    //     $match: {
    //       $or: [
    //         { "player1.id": interaction.user.id },
    //         { "player2.id": interaction.user.id },
    //       ],
    //     },
    //   },
    // ]);

    // console.log({ aggregate });

    let gameExists = await Game.findOne({
      "player1.id": interaction.user.id,
    });

    if (gameExists && gameExists.status === "ongoing") {
      // await interaction.followUp(
      //   "Complete your ongoing duel to escape the fate of a coward!"
      // );
      console.log(gameExists);
      return;
    }

    gameExists = await Game.find({
      $and: [
        {
          $or: [
            { "player1.id": interaction.user.id },
            { "player2.id": interaction.user.id },
          ],
        },
        { status: "ongoing" },
      ],
    });

    gameExists = gameExists.filter(
      (game) =>
        DateTime.fromJSDate(game.createdAt).diffNow("seconds").toObject()
          .seconds < -60
    );

    console.log({ gameExists });

    if (gameExists.length !== 0) {
      // console.log("entering forbidden zone");
      // await interaction.followUp("Complete your ongoing duel coward!");

      return;
    }

    await Game.create({
      gameId: interaction.id,
      player1: { id: interaction.user.id },
      status: "open",
    });

    const value = interaction.options.data[0].value;

    await interaction.reply({
      content: `Do you accept <@${interaction.user.id}>'s challenge for ${
        value === "easy" ? "an" : "a"
      } ${value} duel?`,
      components: [row],
    });
  },
};

export default challenge;
