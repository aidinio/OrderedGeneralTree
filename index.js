import { Node } from "./Node";
import { nodeList } from "./NodeList";
import { CommandHelp } from "./CommandHelp";
import { Canvas } from "./Canvas";

let nodes = new nodeList([
    new Node(0, "root", null, null, null, null),
    // new Node(1, "room", 0, null, null, null),
  // new Node(0, "root", null, null, null, 1),
  //   new Node(1, "room", 0, 2, null, 3),
  //   new Node(2, "room", 0, null, 1, 6),
  //   new Node(3, "bed", 1, 4, null, 7),
  //   new Node(4, "bed", 1, 5, 3, null),
  //   new Node(5, "bed", 1, null, 4, null),
  //   new Node(6, "bed", 2, null, null, 9),
  //   new Node(7, "bunk", 3, 8, null, null),
  //   new Node(8, "bunk", 3, null, 7, null),
  //   new Node(9, "bunk", 6, 10, null, null),
  //   new Node(10, "bunk", 6, null, 9, null),
]);

// let nodes = new nodeList()
let commandHelp = new CommandHelp();
commandHelp.addDoc("moveAfter", "moveAfter {Sibling ID} {Node Id}");
commandHelp.addDoc("moveBefore", "moveBefore {Sibling ID} {Node Id}");
commandHelp.addDoc("swap", "swap {Node1 ID} {Node2 ID}");
commandHelp.addDoc("prependChild", "prependChild {parent ID} {Node ID}");
commandHelp.addDoc("newChild", "newChild {parent ID}");

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

const canvas = new Canvas([
  nodes.show.bind(nodes),
  commandHelp.show.bind(commandHelp),
]);

async function main() {
  while (true) {
    console.clear();
    canvas.show();
    const input = await question("> ");
    canvas.append(`\n> ${input}`);
    if (!input) continue;
    if (input == "exit") break;
    tokens = input.split(" ");
    if (tokens[0] == "moveAfter") {
      nodes.moveAfter(Number(tokens[1]), Number(tokens[2]));
    } else if (tokens[0] == "moveBefore") {
      nodes.moveBefore(Number(tokens[1]), Number(tokens[2]));
    } else if (tokens[0] == "swap") {
      nodes.swap(Number(tokens[1]), Number(tokens[2]));
    } else if (tokens[0] == "prependChild") {
      nodes.prependChild(Number(tokens[1]), Number(tokens[2]));
    } else if (tokens[0] == "newChild") {
      nodes.newChild(Number(tokens[1]));
    }
  }
  rl.close();
}

main();