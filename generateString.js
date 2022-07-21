import { generateSlug } from "random-word-slugs";
import pluralize from "pluralize";
const helpers = ["the", "that", "this"];

const hardHelpers = [
  "after eating",
  "over 2",
  "for some",
  "with those",
  "over a couple",
];

const verbs = [
  "annoyed",
  "disturbed",
  "poked",
  "judged",
  "caressed",
  "seduced",
  "congratulated",
  "fooled",
  "verbally abused",
  "consumed",
  "photographed",
  "punished",
  "texted",
  "cornered",
  "jumped",
  "punched",
  "spat on",
  "danced with",
  "sat on",
  "threw up on",
  "cringed at",
  "bungled up",
  "dabbed on",
  "sheeshed at",
  "stared at",
  "flattered",
  "dealt with",
  "encouraged",
  "visited",
  "caught",
  "bounced on",
  "summoned",
];

const generatePhrase = async (level) => {
  const modFactor = verbs.length - 1;

  if (level === "easy") {
    //easy difficulty
    const easyPhrase = generateSlug(2, {
      partsOfSpeech: ["adjective", "noun"],
      format: "lower",
    });
    console.log(easyPhrase);
    return easyPhrase;
  } else if (level === "medium") {
    //medium difficulty
    let medPhrase = generateSlug(4, {
      partsOfSpeech: ["adjective", "noun", "adjective", "noun"],
      format: "lower",
      categories: {
        noun: ["animals", "profession"],
        adjective: [
          "personality",
          "taste",
          "shapes",
          "condition",
          "appearance",
        ],
      },
    });

    medPhrase = medPhrase.split(" ");

    const verb = verbs[Math.floor(Math.random() * 1000) % modFactor];

    let firstArticle = helpers[Math.floor(Math.random() * 1000) % 3];
    firstArticle = firstArticle.split("");
    firstArticle[0] = firstArticle[0].toUpperCase();
    firstArticle = firstArticle.join("");
    let secondArticle;
    if (firstArticle === "The") {
      if (Math.random() > 0.5) {
        secondArticle = "that";
      } else {
        secondArticle = "this";
      }
    } else if (firstArticle === "This") {
      if (Math.random() > 0.5) {
        secondArticle = "that";
      } else {
        secondArticle = "the";
      }
    } else {
      if (Math.random() > 0.5) {
        secondArticle = "the";
      } else {
        secondArticle = "this";
      }
    }

    //let secondArticle = helpers[Math.floor(Math.random() * 1000) % 3];

    const returnPhrase = `${firstArticle} ${medPhrase[0]} ${medPhrase[1]} ${verb} ${secondArticle} ${medPhrase[2]} ${medPhrase[3]}`;
    console.log(returnPhrase);
    return returnPhrase;
  } else {
    //hard difficulty
    let hardPhrase = generateSlug(4, {
      partsOfSpeech: ["adjective", "noun", "adjective", "noun"],
      format: "lower",
      categories: {
        noun: ["animals", "profession"],
        adjective: [
          "personality",
          "taste",
          "shapes",
          "condition",
          "appearance",
        ],
      },
    });

    let item = generateSlug(1, {
      partsOfSpeech: ["noun"],
      format: "lower",
      categories: {
        noun: ["thing", "food"],
      },
    });

    if (Math.random() > 0.5) {
      item = pluralize(item);
    }

    hardPhrase = hardPhrase.split(" ");

    const verb = verbs[Math.floor(Math.random() * 100) % modFactor];

    const hardHelper =
      hardHelpers[Math.floor(Math.random() * 100) % hardHelpers.length];

    let firstArticle = helpers[Math.floor(Math.random() * 1000) % 3];
    firstArticle = firstArticle.split("");
    firstArticle[0] = firstArticle[0].toUpperCase();
    firstArticle = firstArticle.join("");

    let secondArticle;
    if (firstArticle === "The") {
      if (Math.random() > 0.5) {
        secondArticle = "that";
      } else {
        secondArticle = "this";
      }
    } else if (firstArticle === "This") {
      if (Math.random() > 0.5) {
        secondArticle = "that";
      } else {
        secondArticle = "the";
      }
    } else {
      if (Math.random() > 0.5) {
        secondArticle = "the";
      } else {
        secondArticle = "this";
      }
    }

    const returnPhrase = `${firstArticle} ${hardPhrase[0]} ${hardPhrase[1]} ${verb} ${secondArticle} ${hardPhrase[2]} ${hardPhrase[3]} ${hardHelper} ${item}`;
    console.log(returnPhrase);
    return returnPhrase;
  }
};

export default generatePhrase;
