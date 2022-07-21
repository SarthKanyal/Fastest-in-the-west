import { DateTime } from "luxon";
import Game from "../models/Game.js";
import randomWords from "random-words";
import generatePhrase from "../generateString.js";

const interactionCreate = {
  name: "interactionCreate",

  async execute(interaction) {
    if (interaction.isButton()) {
      if (interaction.customId.startsWith("accept_challenge_")) {
        const gameId = interaction.customId.split("_")[2];
        const content = await generatePhrase(
          interaction.customId.split("_")[3]
        );
        console.log(content);

        try {
          //first check if the player is trying to accept their own game or not
          let currentGame = await Game.findOne({ gameId: gameId });
          console.log(interaction.user);

          if (currentGame.player1.id === interaction.user.id) {
            interaction.replied
              ? await interaction.followUp("No can do pardner")
              : await interaction.reply({ content: "No can do pardner" });
          } else {
            //check if the challengee has any ongoing existing games
            const games = await Game.find({
              $and: [
                {
                  $or: [
                    { "player1.id": interaction.user.id },
                    { "player2.id": interaction.user.id },
                  ],
                },
                {
                  status: "ongoing",
                },
              ],
            });

            if (games.length > 0) {
              await interaction.followUp("Finish your existing duel");
            } else if (
              DateTime.fromJSDate(currentGame.createdAt)
                .diffNow("seconds")
                .toObject().seconds < -60
            ) {
              console.log(
                DateTime.fromJSDate(currentGame.createdAt)
                  .diffNow("seconds")
                  .toObject().seconds < -60
              );
              await Game.deleteOne({ gameId: currentGame.gameId });
              interaction.replied
                ? await interaction.followUp({
                    content: "Looks like this duel has gone stale cowboy",
                  })
                : await interaction.reply({
                    content: "Looks like this duel has gone stale cowboy",
                  });
            } else {
              const updatedGame = await Game.findOneAndUpdate(
                { gameId: gameId },
                {
                  "player2.id": interaction.user.id,
                  word: content,
                  status: "ongoing",
                },
                { new: true, runValidators: true }
              );

              console.log(updatedGame);

              await interaction.update({
                content:
                  "The duel will start in 15 seconds... Type /fire followed by the word displayed on screen and press enter as fast as you can...",
                components: [],
              });
              let msg;
              setTimeout(async () => {
                msg = await interaction.followUp({
                  content: "Countdown starts in 5...",
                });
              }, 5000);

              await new Promise((r) => setTimeout(r, 10000));

              let counter = 5;
              const timer = setInterval(async function () {
                console.log(counter);

                if (counter > 0) {
                  if (counter === 5) {
                    msg = await msg.edit({
                      content: counter.toString(),
                    });
                  } else {
                    msg = await msg.edit({ content: counter.toString() });
                    //await interaction.update({ content: counter.toString() });
                  }
                  //await msg.edit({ content: counter.toString() });
                }
                counter = counter - 1;
                if (counter < 0) {
                  await interaction.followUp({
                    content: `**${content}**`,
                  });

                  clearInterval(timer);
                }
              }, 1000);
            }
          }

          // let game = await Game.find({
          //   $and: [
          //     { "player1.id": interaction.user.id },
          //     { status: "ongoing" },
          //   ],
          // }); //console.log(game);

          // console.log({ game });

          // game = game.filter(
          //   (g) =>
          //     DateTime.fromISO(g.createdAt).diffNow(["seconds"]).toObject()
          //       .seconds > -60
          // );

          // game.forEach((g) =>
          //   console.log(
          //     DateTime.fromJSDate(g.createdAt).diffNow("seconds").toObject()
          //       .seconds
          //   )
          // );
          // console.log({ game });

          // if (game.length > 0) {
          //   await interaction.reply({ content: "No can do pardner" });
          // } else {
          //   const updatedGame = await Game.findOneAndUpdate(
          //     { gameId: gameId },
          //     { "player2.id": interaction.user.id, word: content },
          //     { new: true, runValidators: true }
          //   );

          //   console.log(updatedGame);

          //   await interaction.update({
          //     content:
          //       "The duel will start in 15 seconds... Type /fire followed by the word displayed on screen and press enter as fast as you can...",
          //     components: [],
          //   });
          //   let msg;
          //   setTimeout(async () => {
          //     msg = await interaction.followUp({
          //       content: "Countdown starts in 5...",
          //     });
          //   }, 5000);

          //   await new Promise((r) => setTimeout(r, 10000));

          //   let counter = 5;
          //   const timer = setInterval(async function () {
          //     console.log(counter);

          //     if (counter > 0) {
          //       if (counter === 5) {
          //         msg = await msg.edit({
          //           content: counter.toString(),
          //         });
          //       } else {
          //         msg = await msg.edit({ content: counter.toString() });
          //         //await interaction.update({ content: counter.toString() });
          //       }
          //       //await msg.edit({ content: counter.toString() });
          //     }
          //     counter = counter - 1;
          //     if (counter < 0) {
          //       await interaction.followUp({
          //         content: `**${content}**`,
          //       });

          //       clearInterval(timer);
          //     }
          //   }, 1000);
          // }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      try {
        if (interaction.commandName === "challenge") {
          interaction.client.player1 = {
            id: interaction.user.id,
            played: false,
          };
        }

        const command = interaction.client.commands.filter(
          (command) => command.name === interaction.commandName
        );

        await interaction.client.commandCollection[command[0].name].execute(
          interaction
        );
      } catch (error) {
        console.log(error);
        interaction.reply("there was an error");
      }
    }
  },
};

export default interactionCreate;
