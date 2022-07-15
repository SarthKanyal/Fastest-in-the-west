import { DateTime } from "luxon";
import randomWords from "random-words";
const interactionCreate = {
  name: "interactionCreate",

  async execute(interaction) {
    if (interaction.isButton()) {
      if (interaction.customId === "accept_challenge") {
        try {
          interaction.client.player2 = {
            id: interaction.user.id,
            played: false,
          };

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
          const content = randomWords();

          let counter = 5;
          const timer = setInterval(async function () {
            console.log(counter);
            if (counter > 0) {
              //await msg.edit({ content: counter.toString() });
              await interaction.followUp({ content: counter.toString() });
            }
            counter = counter - 1;
            if (counter < 0) {
              await interaction.followUp({
                content: content,
              });

              clearInterval(timer);
            }
          }, 1000);
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      try {
        // console.log(interaction.commandName);
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
