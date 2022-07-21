import Game from "../models/Game.js";
import stringSimilarity from "string-similarity";
import { DateTime } from "luxon";

const decideWinner = async (interaction, game, player) => {
  const now = DateTime.utc().toISO();

  const playerId = interaction.user.id;
  if (player === 1) {
    if (!game.player1.played && game.status !== "over") {
      const game1 = await Game.findOneAndUpdate(
        { "player1.id": playerId },
        {
          "player1.played": true,
          "player1.input": interaction.options.data[0].value,
          "player1.timestamp": now,
        },
        { runValidators: true, new: true }
      );

      interaction.replied
        ? await interaction.followUp("Pew Pew Pew")
        : await interaction.reply("Pew Pew Pew");

      if (
        game1.player1.played &&
        game1.player2.played &&
        game1.status === "ongoing"
      ) {
        await finishGame({ game: game1 }, interaction);
        await Game.findOneAndUpdate(
          { gameId: game1.gameId },
          { status: "over" }
        );
      }
      return;
    }
  } else {
    if (game && !game.player2.played && game.status !== "over") {
      const game2 = await Game.findOneAndUpdate(
        { "player2.id": playerId },
        {
          "player2.played": true,
          "player2.input": interaction.options.data[0].value,
          "player2.timestamp": now,
        },
        { runValidators: true, new: true }
      );

      interaction.replied
        ? await interaction.followUp("Pew Pew Pew")
        : await interaction.reply("Pew Pew Pew");

      if (
        game2.player1.played &&
        game2.player2.played &&
        game2.status === "ongoing"
      ) {
        await finishGame({ game: game2 }, interaction);
        await Game.findOneAndUpdate(
          { gameId: game2.gameId },
          { status: "over" }
        );
      }
      return;
    }
  }
};

const finishGame = async ({ game }, interaction) => {
  const p1Result = stringSimilarity.compareTwoStrings(
    game.word,
    game.player1.input
  );
  const p2Result = stringSimilarity.compareTwoStrings(
    game.word,
    game.player2.input
  );

  const p1Time = DateTime.fromISO(game.player1.timestamp);
  const p2Time = DateTime.fromISO(game.player2.timestamp);

  if (p1Result * 100 - p2Result * 100 <= 10) {
    await interaction.followUp(tieBreaker(p1Time, p2Time, game));
  } else {
    if (p1Result > p2Result) {
      await interaction.followUp(winnerStatement(1, game));
      return;
    } else {
      await interaction.followUp(winnerStatement(2, game));
      return;
    }
  }
};

const tieBreaker = (p1Time, p2Time, game1) => {
  console.log(p1Time, p2Time);
  const diff = p1Time.diff(p2Time).toObject().milliseconds;
  console.log(diff);
  console.log(game1);
  if (diff > 0) {
    console.log("true");
    console.log(game1.player2);
    return `After a chaotic battle, once the smoke clears out, curious onlookers find both gunslingers lying still. Until they hear <@${game1.player2.id}>'s soft raspy croak...`;
  } else {
    console.log(game1.player1);
    return `After a chaotic battle, once the smoke clears out, curious onlookers find both gunslingers lying still. Until they hear <@${game1.player1.id}>'s soft raspy croak...`;
  }
};

const winnerStatement = (winner, game) => {
  if (winner === 1) {
    return `<@${game.player1.id}> ends the duel with a clean precise shot blowing <@${game.player2.id}>'s knickers right off!`;
  } else {
    return `<@${game.player2.id}> ends the duel with a clean precise shot blowing <@${game.player1.id}>'s knickers right off!`;
  }
};

export default decideWinner;
